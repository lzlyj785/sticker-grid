"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, ImageIcon, Download } from "lucide-react"

export default function ImageGeneratorPage() {
  const [selectedStyle, setSelectedStyle] = useState("")
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [generatedImages, setGeneratedImages] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  // 样式选项
  const styleOptions = [
    { value: "watercolor", label: "水彩" },
    { value: "oil", label: "油画" },
    { value: "sketch", label: "素描" },
    { value: "cartoon", label: "卡通" },
    { value: "anime", label: "动漫" },
  ]

  // 处理图片上传
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // 生成图片
  const handleGenerate = () => {
    if (!uploadedImage || !selectedStyle) return

    setIsGenerating(true)

    // 模拟生成过程
    setTimeout(() => {
      // 创建9张模拟的生成图片
      const mockImages = Array(9)
        .fill(0)
        .map((_, i) => `/placeholder.svg?height=200&width=200&text=Style:${selectedStyle}+${i + 1}`)
      setGeneratedImages(mockImages)
      setIsGenerating(false)
    }, 1500)
  }

  // 下载全部图片
  const handleDownloadAll = () => {
    // 实际应用中，这里会处理批量下载逻辑
    alert("下载全部图片功能将在这里实现")
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">图片风格转换器</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* 上传按钮 */}
        <div className="flex flex-col items-center gap-2">
          <div className="text-center mb-2">① 上传图片</div>
          <div className="relative">
            <Button variant="outline" className="w-full">
              <Upload className="mr-2 h-4 w-4" />
              选择图片
              <input
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </Button>
          </div>
          {uploadedImage && (
            <div className="mt-2 border rounded-md p-2 w-full">
              <img src={uploadedImage || "/placeholder.svg"} alt="已上传图片" className="w-full h-40 object-contain" />
            </div>
          )}
        </div>

        {/* 风格选择 */}
        <div className="flex flex-col items-center gap-2">
          <div className="text-center mb-2">② 选择风格</div>
          <Select value={selectedStyle} onValueChange={setSelectedStyle}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="选择转换风格" />
            </SelectTrigger>
            <SelectContent>
              {styleOptions.map((style) => (
                <SelectItem key={style.value} value={style.value}>
                  {style.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 生成按钮 */}
        <div className="flex flex-col items-center gap-2">
          <div className="text-center mb-2">③ 生成图片</div>
          <Button
            className="w-full"
            onClick={handleGenerate}
            disabled={!uploadedImage || !selectedStyle || isGenerating}
          >
            <ImageIcon className="mr-2 h-4 w-4" />
            {isGenerating ? "生成中..." : "生成"}
          </Button>
        </div>
      </div>

      {/* 预览区域 */}
      <div className="mb-8">
        <div className="text-center mb-4">④ 预览效果</div>
        {generatedImages.length > 0 ? (
          <div className="grid grid-cols-3 gap-4">
            {generatedImages.map((img, index) => (
              <div key={index} className="border rounded-md overflow-hidden">
                <img
                  src={img || "/placeholder.svg"}
                  alt={`生成图片 ${index + 1}`}
                  className="w-full h-48 object-cover"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="border rounded-md p-8 text-center text-muted-foreground">
            上传图片并选择风格后点击生成按钮查看效果
          </div>
        )}
      </div>

      {/* 下载按钮 */}
      <div className="flex justify-center">
        <div className="text-center">
          <div className="mb-2">⑤ 下载图片</div>
          <Button variant="outline" onClick={handleDownloadAll} disabled={generatedImages.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            下载全部
          </Button>
        </div>
      </div>
    </div>
  )
}
import { CldUploadWidget } from "next-cloudinary";    // yarn add next-cloudinary
import JSZip from "jszip";                            // yarn add jszip
...
// 上传原图
<CldUploadWidget cloudName={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD}
  uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_PRESET}
  onUpload={(r)=> setSrc(r.secure_url)} >
  {({open})=> <Button onClick={()=>open()}>上传图片</Button>}
</CldUploadWidget>

// 生成按钮
const handleGenerate = async()=>{
  const res = await fetch("/api/generate",{method:"POST",body:JSON.stringify({
     imageUrl: src, style: stylePrompt
  })});
  const {url} = await res.json();
  const pieces = await sliceNine(url);   // ↓↓↓
  setPieces(pieces);
}

// 九宫格函数
const sliceNine = async (src:string)=>{
  const img=await createImageBitmap(await fetch(src).then(r=>r.blob()));
  const s=img.width/3, cvs=document.createElement("canvas");
  cvs.width=cvs.height=s; const ctx=cvs.getContext("2d")!;
  const out:string[]=[];
  for(let y=0;y<3;y++)for(let x=0;x<3;x++){
    ctx.clearRect(0,0,s,s);
    ctx.drawImage(img,x*s,y*s,s,s,0,0,s,s);
    out.push(cvs.toDataURL("image/png"));
  }
  return out;
}                                                // :contentReference[oaicite:12]{index=12}

// 下载九图
const downloadAll = async()=>{
  const zip = new JSZip();
  pieces.forEach((p,i)=> zip.file(`sticker_${i+1}.png`, p.split(",")[1], {base64:true}));
  const blob = await zip.generateAsync({type:"blob"});
  saveAs(blob,"stickers.zip");                 // yarn add file-saver
}
