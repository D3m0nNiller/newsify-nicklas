import { Link, NavLink } from "react-router"
import { CiBookmark, CiHome, CiSettings, CiStar } from 'react-icons/ci'

export default function Links() {
    return (
        <>
            <div className="links__">
                <NavLink to="/home" className='links__icon'>
                    <CiHome className='links__home' />
                    <p className='links__linkText'>Home</p>
                </NavLink>
                <NavLink to="/archive" className='links__icon'>
                    <CiBookmark className='links__bookMark' />
                    <p className='links__linkText'>Archive</p>
                </NavLink>
                <NavLink to="/popular" className='links__icon'>
                    <CiStar className='links__popular' />
                    <p className='links__linkText'>Popular</p>
                </NavLink>
                <NavLink to="/settings" className='links__icon'>
                    <CiSettings className='links__settings' />
                    <p className='links__linkText'>Settings</p>
                </NavLink>
            </div>
        </>
    )
}
