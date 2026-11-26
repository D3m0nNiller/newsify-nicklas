import React from 'react'
import { CiBookmark, CiHome, CiSettings, CiStar } from 'react-icons/ci'

export default function Links() {
    return (
        <>
            <div className="links__">
                <div className='links__icon'>
                    <CiHome className='links__home' />
                    <p className='links__linkText'>Home</p>
                </div>
                <div className='links__icon'>
                    <CiBookmark className='links__bookMark' />
                    <p className='links__linkText'>Archive</p>
                </div>
                <div className='links__icon'>
                    <CiStar className='links__popular' />
                    <p className='links__linkText'>Popular</p>
                </div>
                <div className='links__icon'>
                    <CiSettings className='links__settings' />
                    <p className='links__linkText'>Settings</p>
                </div>
            </div>
        </>
    )
}
