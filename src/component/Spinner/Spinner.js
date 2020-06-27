import React from 'react'

import './Spinner.css'

const Spinner = ({ color }) => {
  return (
    <div>
      <div class="lds-ring">
        <div style={{
          border:`8px solid ${color || "#E76975"}`,
          borderColor: `${color || "#E76975"} transparent transparent transparent`
        }}></div>
        <div style={{
          border:`8px solid ${color || "#E76975"}`,
          borderColor: `${color || "#E76975"} transparent transparent transparent`
        }}></div>
        <div style={{
          border:`8px solid ${color || "#E76975"}`,
          borderColor: `${color || "#E76975"} transparent transparent transparent`
        }}></div>
        <div style={{
          border:`8px solid ${color || "#E76975"}`,
          borderColor: `${color || "#E76975"} transparent transparent transparent`
        }}></div>
      </div>
    </div>
  )
}

export default Spinner
