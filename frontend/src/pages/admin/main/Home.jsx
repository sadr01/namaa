import React from 'react'

import { icons, getIconByTitle } from "../../../more/icons";
export default function Home() {
  return (
    <div>
      {icons.slice(0, 20).map(({ title, icon }) => (
        <div key={title}>
          {icon} {title}
        </div>
      ))}

      <h3>انتخاب با اسم:</h3>
      {getIconByTitle("Pinterest")} Telegram
    </div>
  )
}
