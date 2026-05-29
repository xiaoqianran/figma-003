import './index.css'

// GODY 黄控台 - React 重构版本
// 目标：保留极致工业档案美学 + 专业原型评审能力，迁移到现代技术栈

function App() {
  return (
    <div className="lab-grid min-h-screen text-[#EDEBE5]">
      <div className="max-w-[1340px] mx-auto px-8 pt-9 pb-12">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-x-3">
              <div className="w-7 h-7 bg-[#fecc2a] flex items-center justify-center">
                <div className="w-3.5 h-3.5 bg-[#0A0908]" />
              </div>
              <span className="display-font text-5xl font-bold tracking-[-1.5px]">GODY</span>
            </div>
            <div className="ml-11 -mt-1 flex items-center gap-x-2">
              <span className="section-label tracking-[2.5px]">PROTOTYPE CONSOLE</span>
              <span className="text-[#B8B5B0] text-xs console-font">REACT + VITE</span>
            </div>
          </div>

          <div className="text-sm text-[#B8B5B0] console-font">
            44 PROTOTYPES • INDUSTRIAL ARCHIVE
          </div>
        </div>

        <div className="flex gap-8">
          {/* Left: Navigation placeholder */}
          <div className="w-72 flex-shrink-0">
            <div className="metal rounded-2xl p-4">
              <div className="section-label mb-3 px-2">ARCHIVE</div>
              <div className="text-sm text-[#B8B5B0] px-2 leading-relaxed">
                完整动态导航、搜索、分类筛选、用户旅程播放器正在迁移中...
              </div>
              <div className="mt-6 text-[10px] console-font text-[#6E6A61] px-2 border-t border-[#2A2926] pt-4">
                当前为 React 重构初期版本<br />
                核心视觉系统已迁移
              </div>
            </div>
          </div>

          {/* Center: Device Simulator */}
          <div className="flex-1 flex flex-col items-center pt-2">
            <div className="mb-3">
              <span className="section-label">DEVICE LAB</span>
            </div>

            <div className="hardware-frame mx-auto">
              <div className="device-bevel relative">
                {/* Top metal bar */}
                <div className="absolute top-0 left-0 right-0 h-9 bg-gradient-to-b from-[#1F1F1C] to-transparent z-20 flex items-center justify-center">
                  <div className="flex items-center gap-x-[6px]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#3A3A36]" />
                    <span className="text-[9px] text-[#B8B5B0] console-font tracking-[1.5px]">GODY LAB • REACT</span>
                  </div>
                </div>

                <div className="prototype-screen mt-9 mx-2 mb-2 relative flex items-center justify-center bg-[#F5F3ED]">
                  <div className="text-center text-[#0A0908] console-font text-sm px-8">
                    React 版本的设备模拟器正在构建中<br />
                    <span className="text-xs opacity-60 mt-2 block">
                      将完整保留之前的优秀视觉与交互体验
                    </span>
                  </div>
                </div>

                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-[108px] h-[5px] bg-[#2A2926] rounded-full z-30" />
              </div>
            </div>

            <div className="mt-3 text-xs text-[#B8B5B0] console-font">
              375 × 812 • iPhone 13 物理模拟
            </div>
          </div>

          {/* Right Panel */}
          <div className="w-80 flex-shrink-0">
            <div className="metal rounded-3xl p-6 text-sm leading-relaxed">
              <div className="section-label text-[#0A0908] mb-3">REFACTOR STATUS</div>
              <div className="text-[#0A0908] text-xl font-medium mb-4">正在迁移至现代技术栈</div>

              <ul className="text-[#3F3D37] space-y-2 text-sm">
                <li>✓ Vite + React + TypeScript</li>
                <li>✓ Tailwind + 工业档案设计令牌</li>
                <li>○ 设备模拟器组件化</li>
                <li>○ 完整页面注册表 + 搜索筛选</li>
                <li>○ 用户旅程自动播放器</li>
                <li>○ 专业工具栏（缩放 / 旋转 / 弹出）</li>
              </ul>

              <div className="mt-6 pt-4 border-t border-[#D9D4C8] text-xs text-[#6E6A61]">
                目标：保留「黄控台」极致美学，同时获得组件化、可维护、可扩展的现代前端架构。
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
