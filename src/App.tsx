import { useState } from 'react'
import './index.css'

// Import the registry we migrated
import pageRegistry from './page-registry.json'

interface Prototype {
  id: string
  path: string
  displayName: string
  category: string
  description: string
}

const prototypes: Prototype[] = pageRegistry as Prototype[]

const categories = ['All', ...Array.from(new Set(prototypes.map(p => p.category)))]

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedPrototype, setSelectedPrototype] = useState<Prototype | null>(null)
  const [zoom, setZoom] = useState(1)
  const [isRotated, setIsRotated] = useState(false)

  // Filter prototypes
  const filteredPrototypes = prototypes.filter(p => {
    const matchesSearch = p.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory
    return matchesSearch && matchesCategory
  })

  const handleSelectPrototype = (proto: Prototype) => {
    setSelectedPrototype(proto)
  }

  const currentIframeSrc = selectedPrototype 
    ? `/prototypes/${selectedPrototype.path}` 
    : null

  return (
    <div className="lab-grid min-h-screen text-[#EDEBE5]">
      <div className="max-w-[1340px] mx-auto px-8 pt-9">
        {/* Header - 黄控台风格 */}
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
              <span className="text-[#B8B5B0] text-xs console-font">REACT EDITION</span>
            </div>
          </div>

          <div className="text-sm text-[#B8B5B0] console-font">
            {prototypes.length} PROTOTYPES • INDUSTRIAL ARCHIVE
          </div>
        </div>

        <div className="flex gap-8">
          {/* Left Sidebar - Dynamic Registry */}
          <div className="w-72 flex-shrink-0">
            <div className="metal rounded-2xl p-3">
              <div className="px-2 pb-2">
                <input
                  type="text"
                  placeholder="搜索原型..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#0A0908] border border-[#2A2926] text-sm px-3 py-2 rounded-lg console-font placeholder:text-[#6E6A61] focus:outline-none focus:border-[#fecc2a]/50"
                />
              </div>

              {/* Category Filters */}
              <div className="flex flex-wrap gap-1 px-2 pb-3">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`text-[10px] px-2.5 py-0.5 rounded-full border transition-colors console-font ${
                      activeCategory === cat 
                        ? 'bg-[#fecc2a] text-[#0A0908] border-[#fecc2a]' 
                        : 'border-[#2A2926] text-[#B8B5B0] hover:text-[#EDEBE5]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Prototype List */}
              <div className="max-h-[520px] overflow-y-auto pr-1 space-y-0.5 text-sm">
                {filteredPrototypes.length > 0 ? (
                  filteredPrototypes.map(proto => (
                    <button
                      key={proto.id}
                      onClick={() => handleSelectPrototype(proto)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2 console-font ${
                        selectedPrototype?.id === proto.id 
                          ? 'bg-[#1F1E1B] text-[#fecc2a] border-l-2 border-[#fecc2a]' 
                          : 'hover:bg-[#1A1916] text-[#EDEBE5]'
                      }`}
                    >
                      <span className="truncate">{proto.displayName}</span>
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-4 text-[#6E6A61] text-xs">没有匹配的结果</div>
                )}
              </div>
            </div>
          </div>

          {/* Center: React Device Simulator */}
          <div className="flex-1 flex flex-col items-center">
            <div className="flex items-center gap-4 mb-3">
              <span className="section-label">DEVICE LAB</span>
              
              {/* Zoom Controls */}
              <div className="flex items-center gap-2 text-xs console-font">
                <button onClick={() => setZoom(0.75)} className="tb-btn">75%</button>
                <button onClick={() => setZoom(1)} className="tb-btn">100%</button>
                <button onClick={() => setZoom(1.25)} className="tb-btn">125%</button>
                <input 
                  type="range" 
                  min="0.5" 
                  max="1.8" 
                  step="0.05" 
                  value={zoom} 
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-20 accent-[#fecc2a]"
                />
                <span className="text-[#fecc2a] w-10 text-right">{Math.round(zoom * 100)}%</span>
              </div>

              <button 
                onClick={() => setIsRotated(!isRotated)}
                className="tb-btn"
              >
                {isRotated ? 'Portrait' : 'Landscape'}
              </button>
            </div>

            {/* The Device */}
            <div 
              className="hardware-frame mx-auto transition-transform duration-300"
              style={{ 
                transform: `scale(${zoom}) rotate(${isRotated ? 90 : 0}deg)`,
                transformOrigin: 'center'
              }}
            >
              <div className="device-bevel relative">
                <div className="absolute top-0 left-0 right-0 h-9 bg-gradient-to-b from-[#1F1F1C] to-transparent z-20 flex items-center justify-center">
                  <span className="text-[9px] text-[#B8B5B0] console-font tracking-[1.5px]">GODY LAB • REACT</span>
                </div>

                <div className="prototype-screen mt-9 mx-2 mb-2 relative">
                  {currentIframeSrc ? (
                    <iframe 
                      src={currentIframeSrc} 
                      className="w-full h-full" 
                      title={selectedPrototype?.displayName}
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center text-[#0A0908] console-font text-sm">
                      请选择左侧原型进行预览
                    </div>
                  )}
                </div>

                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-[108px] h-[5px] bg-[#2A2926] rounded-full z-30" />
              </div>
            </div>

            <div className="mt-2 text-xs text-[#B8B5B0] console-font">
              375 × 812 • iPhone 13 物理模拟
            </div>
          </div>

          {/* Right Panel */}
          <div className="w-80 flex-shrink-0">
            <div className="metal rounded-3xl p-6">
              <div className="section-label text-[#0A0908] mb-2">CURRENT</div>
              {selectedPrototype ? (
                <>
                  <div className="text-[#0A0908] text-xl leading-tight font-medium mb-4">
                    {selectedPrototype.displayName}
                  </div>
                  <div className="text-xs text-[#3F3D37] space-y-1">
                    <div><span className="text-[#6E6A61]">Category:</span> {selectedPrototype.category}</div>
                    <div className="pt-2 text-[#6E6A61]">{selectedPrototype.description}</div>
                  </div>
                </>
              ) : (
                <div className="text-[#3F3D37] text-sm">选择一个原型查看详情</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
