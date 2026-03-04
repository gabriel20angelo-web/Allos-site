interface Props { label?: string; className?: string; }
export default function ImagePlaceholder({ label="Coloque sua imagem aqui", className="" }: Props) {
  return (
    <div className={`flex flex-col items-center justify-center gap-4 rounded-2xl ${className}`}
      style={{background:"#F5F0E8",border:"2px dashed #D4CBB8"}}>
      <div className="w-12 h-12 rounded-full flex items-center justify-center"
        style={{background:"rgba(200,75,49,.08)",border:"1px solid rgba(200,75,49,.2)"}}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C84B31" strokeWidth="1.5" strokeLinecap="round">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <path d="M21 15l-5-5L5 21"/>
        </svg>
      </div>
      <p className="font-dm text-[#5C5C5C] text-sm font-medium">{label}</p>
    </div>
  );
}
