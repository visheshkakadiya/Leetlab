import { Link } from 'react-router-dom'
import { Code } from 'lucide-react'

export const Logo = () => {
    return (
        <div>
            <Link to="/" className='flex gap-2 items-center'>
                <Code className="h-6 w-6 text-emerald-400" />
                <span className="text-lg font-bold">NexCode</span>
            </Link>
        </div>
    )
}
