export default function AdminPlaceholder({ title }: { title: string }) {
    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">{title}</h1>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center text-gray-500">
                Próximamente: Gestión de {title}
            </div>
        </div>
    )
}
