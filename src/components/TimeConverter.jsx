import React, { useState } from 'react'

export default function TimeConverter(){
  const [hours, setHours] = useState('')
  const [minutes, setMinutes] = useState('')

  function onHoursChange(e){
    const h = e.target.value
    setHours(h)

    if(h === '' || isNaN(h)){
      setMinutes('')
      return
    }

    setMinutes(String(Number(h) * 60))
    }

  function onMinutesChange(e){
    const m = e.target.value
    setMinutes(m)

    if(m === '' || isNaN(m)){
      setHours('')
      return
    }

    setHours(String(Number(m) / 60))
  }

  return (
    <div className="time-box">
      <h2>Conversor de Horas ↔ Minutos</h2>

      <div className="time-row">
        <div className="time-col">
          <label>Horas (24h)</label>
          <input
            type="number"
            value={hours}
            onChange={onHoursChange}
            placeholder="Ingresa horas"
          />
        </div>

        <div className="time-col">
          <label>Minutos</label>
          <input
            type="number"
            value={minutes}
            onChange={onMinutesChange}
            placeholder="Ingresa minutos"
          />
        </div>
      </div>
    </div>
  )
}
