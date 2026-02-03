import React, { useState } from 'react'
import Modaladmins from '../Dashboard/Modaladmins'

const Newadmin = () => {

    const [showModalnew, setShowModalnew] = useState(false)

    const handleClose = () => setShowModalnew(false)

    const handleAdd = (e) => {
        e.preventDefault()
        setShowModalnew(false) 
    }

    return (
        <div className='m-2'>
            <Modaladmins show={showModalnew} onClose={handleClose} onAdd={handleAdd} />
        </div>
    )
}

export default Newadmin
