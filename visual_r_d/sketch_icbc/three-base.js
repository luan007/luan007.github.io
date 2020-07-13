import * as dat from "dat.gui";

import * as three from "three";
import { BloomEffect, EffectComposer, EffectPass, RenderPass, BlendFunction, ToneMappingEffect } from "postprocessing";
import { UnrealBloomPass } from "./patched/UnreallBloomPassPatched";
import { FilmPass } from "three/examples/jsm/postprocessing/FilmPass";

///////PATCH
export function renderer_patch_postprocessing(renderer) {
    UnrealBloomPass.prototype = Object.assign(UnrealBloomPass.prototype, {
        initialize() { },
        originalRender: UnrealBloomPass.prototype.render,
        render(renderer, inputBuffer, outputBuffer, delta, maskActive) {
            this.originalRender(renderer, outputBuffer, inputBuffer, delta, maskActive);
        }
    });

    FilmPass.prototype = Object.assign(FilmPass.prototype, {
        initialize() { },
        originalRender: FilmPass.prototype.render,
        render(renderer, inputBuffer, outputBuffer, delta, maskActive) {
            this.originalRender(renderer, outputBuffer, inputBuffer, delta, maskActive);
        }
    });
}

export function renderer_fullscreen_dpi(renderer, DPI) {
    DPI = DPI || window.devicePixelRatio;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(DPI);
}

export function renderer_shadow_vsm(renderer) {
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.VSMShadowMap;
}

function tweakable_obj_to_folder(obj, onchange, _root, _skip) {
    var gui_folder = _root || new dat.GUI();
    var _skip = _skip || {};
    for (var i in obj) {
        if (typeof (obj[i]) == 'object' && (_skip[i] !== true)) {
            var r = gui_folder.addFolder(i)
            tweakable_obj_to_folder(obj[i], onchange, r, _skip[i]);
        }
        if (_skip[i]) continue;
        else {
            if (i.toLowerCase().endsWith("color") ||
                i.toLowerCase().startsWith("color")) {
                gui_folder.addColor(obj, i).onFinishChange(onchange);
            }
            else {
                gui_folder.add(obj, i).onFinishChange(onchange);
            }
        }
    }
    return gui_folder;
}

///////PATCH
export function renderer_tone_mapping(renderer, scene, base_config, gui_root) {
    window.renderer = renderer;

    var toneMappingOptions = {
        None: THREE.NoToneMapping,
        Linear: THREE.LinearToneMapping,
        Reinhard: THREE.ReinhardToneMapping,
        Cineon: THREE.CineonToneMapping,
        ACESFilmic: THREE.ACESFilmicToneMapping,
        Custom: THREE.CustomToneMapping
    };

    var config = {
        enabled: true,
        aces_exposure: 2,
        toneMapping: "ACESFilmic",
        gamma: 2.2,
        toneMappingExposure: 1,
        physicallyCorrectLights: true
    };

    for (var i in base_config) {
        config[i] = base_config[i];
    }

    var restore = {
        gamma: 1,
        aces_exposure: 1,
        toneMappingExposure: 1,
        physicallyCorrectLights: false
    }

    console.warn("Enabling ACES Filmic Tone Mapping - Note, RootShader has been patched.")
    renderer.outputEncoding = THREE.sRGBEncoding;

    //uncharted
    three.ShaderChunk.tonemapping_pars_fragment = three.ShaderChunk.tonemapping_pars_fragment.replace(
        'vec3 CustomToneMapping( vec3 color ) { return color; }',
        `#define Uncharted2Helper( x ) max( ( ( x * ( 0.15 * x + 0.10 * 0.50 ) + 0.20 * 0.02 ) / ( x * ( 0.15 * x + 0.50 ) + 0.20 * 0.30 ) ) - 0.02 / 0.30, vec3( 0.0 ) )
        float toneMappingWhitePoint = 1.0;
        vec3 CustomToneMapping( vec3 color ) {
            color *= toneMappingExposure;
            return saturate( Uncharted2Helper( color ) / Uncharted2Helper( vec3( toneMappingWhitePoint ) ) );
        }`
    );

    var unpatched = three.ShaderChunk.tonemapping_pars_fragment;

    function apply_config() {
        if (config.enabled) {
            renderer.toneMapping = toneMappingOptions[config.toneMapping]
            for (var i in restore) {
                renderer[i] = config[i];
            }
        }
        else {
            renderer.toneMapping = three.NoToneMapping;
            for (var i in restore) {
                renderer[i] = restore[i];
            }
        }
        three.ShaderChunk.tonemapping_pars_fragment = unpatched.replace("return saturate( color );", "return color * " + (Math.round(config.aces_exposure * 10) / 10).toFixed(1) + ";");
        scene.traverse(object => {
            if (object.type === 'Mesh') object.material.needsUpdate = true;
        });
    }
    apply_config();
    var tweakable = tweakable_obj_to_folder(config, apply_config, gui_root, { toneMapping: true });
    tweakable.add(config, "toneMapping", Object.keys(toneMappingOptions)).onChange(apply_config);
    return {
        tweakable: tweakable,
        config: config,
        apply: apply_config
    }
}