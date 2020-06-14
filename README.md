## /Tricks

记录利用前后端技术制作视觉特效、奇怪互动、以及操作硬件等奇葩技巧。

Current place for code tutorials / experiments.

`VFX-*` - Set of Tricks & Demos around visual effects

`UUX-*` - Testing new UX possibilities.


### /Tricks/VFX-CHEAP-DIFFUSER

Implementing diffusing effect (with particles) only using canvas-2d & simple FBO feedback loop. (Mobile friendly)

![Diffuser](/tricks/vfx-cheap-diffuser/vfx-2.gif)

[Demo Link](http://luan007.github.com/tricks/vfx-cheap-diffuser)

通过双canvas反馈，模拟水墨或散开类效果。此类利用FBO反馈构成的视觉效果不要求高性能，同时可以带来景深错觉。



### /Tricks/VFX-DIFFERED-NOISE-STREAM

Simple particle driven noise visualisation (stream alike)

![FX](/tricks/vfx-differed-noise-stream/recording.gif)

![FINAL](/tricks/vfx-differed-noise-stream/capture.png)

[Demo Link](http://luan007.github.com/tricks/vfx-differed-noise-stream/)

一个简单的粒子系统，要点是用noise驱动粒子转向属性（而不是速度），来实现这个效果。

同时不清空画布，积累渲染结果。



### /Tricks/VFX-NOISE-PLASMA

Grid lit with high & low frequency perlin noise, decorated with stretched H/V noise. The segmentation is done by using multiplication(*) & then mod (%) by 1.

![FX](/tricks/vfx-noise-plasma/capture.gif)

[Demo Link](http://luan007.github.com/tricks/vfx-noise-plasma/)

可用于模拟地形的可视化网格，利用高低频率的Noise叠加模拟出来。横向和纵向游走的“粒子”形态视觉细节由Noise坐标乘法完成。
分层（地形等高线的感觉）由乘积放大后取小数位实现。


## /Visual Experiments

Archived, not updated anymore.