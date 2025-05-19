import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCode } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'

export const Logo = () => {
    return (
        <div>
            <Link to="/" className='flex gap-2 items-center'>
                <FontAwesomeIcon icon={faCode} size="2x" style={{ color: '#A855F7' }} />
                <span className='font-bold text-white'>leetLab</span>
            </Link>
        </div>
    )
}
