import React, { useState } from 'react'
import * as XLSX from 'xlsx'

function downloadFile(filename, content) {
  const blob = new Blob([content], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function jsonToExcelWorkbook(jsonArray){
  const dialogues = []
  const choices = []

  jsonArray.forEach(node => {
    if(node.type === 'choices'){
      (node.choices || []).forEach((c, idx)=>{
        choices.push({
          node_id: node.id,
          choice_index: idx,
          text: c.text || '',
          next: c.next || '',
          description: c.description || '',
          background: node.background || '',
          music: node.music || '',
          previous: node.previous || ''
        })
      })
    } else {
      (node.dialogue || []).forEach((d, idx)=>{
        dialogues.push({
          node_id: node.id,
          line_index: idx,
          speaker: d.speaker || '',
          text: d.text || '',
          background: node.background || '',
          music: node.music || '',
          next: node.next || '',
          previous: node.previous || '',
          sound: d.sound || '',
          event: JSON.stringify(d.event || {}),
          flags: (d.flags || []).join(','),
          config: (node.config || []).join(',')
        })
      })
    }
  })

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(dialogues), 'dialogues')
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(choices), 'choices')

  return wb
}

function tryParseSafe(str){
  try{ return JSON.parse(str) } catch { return {} }
}

function workbookToJson(wb){
  const dSheet = wb.SheetNames.includes('dialogues')
    ? XLSX.utils.sheet_to_json(wb.Sheets['dialogues'])
    : []

  const cSheet = wb.SheetNames.includes('choices')
    ? XLSX.utils.sheet_to_json(wb.Sheets['choices'])
    : []

  const grouped = {}
  dSheet.forEach(r => {
    const id = r.node_id || 'unknown'
    if(!grouped[id]) grouped[id] = {
      id,
      type: 'dialogue',
      background: r.background || '',
      music: r.music || '',
      previous: r.previous || '',
      next: r.next || '',
      config: (r.config || '').split(',').filter(Boolean),
      dialogue: []
    }

    grouped[id].dialogue.push({
      speaker: r.speaker || '',
      text: r.text || '',
      sound: r.sound || '',
      event: tryParseSafe(r.event),
      flags: (r.flags || '').split(',').filter(Boolean)
    })
  })

  const groupedChoices = {}
  cSheet.forEach(r => {
    const id = r.node_id || 'unknown'

    if(!groupedChoices[id]) groupedChoices[id] = {
      id,
      type: 'choices',
      background: r.background || '',
      music: r.music || '',
      previous: r.previous || '',
      choices: []
    }

    groupedChoices[id].choices.push({
      text: r.text || '',
      next: r.next || '',
      description: r.description || ''
    })
  })

  return [...Object.values(grouped), ...Object.values(groupedChoices)]
}

export default function Converter(){
  const [mode, setMode] = useState('excelToJson')
  const [msg, setMsg] = useState('')

  async function handleFile(e){
    const file = e.target.files[0]
    if(!file) return

    setMsg('Procesando...')

    const data = await file.arrayBuffer()

    try{
      if(mode === 'excelToJson'){
        const wb = XLSX.read(data, { type: 'array' })
        const result = workbookToJson(wb)
        downloadFile('mainStory_output.json', JSON.stringify(result, null, 2))
        setMsg('✔ JSON generado correctamente')
      } else {
        const text = new TextDecoder().decode(data)
        const arr = JSON.parse(text)
        const wbOut = jsonToExcelWorkbook(arr)
        XLSX.writeFile(wbOut, 'dialogos.xlsx')
        setMsg('✔ Excel generado correctamente')
      }
    } catch(err){
      setMsg('Error: ' + err.message)
    }
  }

  return (
    <div className="converter">
      <div className="controls">
        <label>
          <input
            type="radio"
            checked={mode==='excelToJson'}
            onChange={()=>setMode('excelToJson')}
          /> Excel → JSON
        </label>

        <label>
          <input
            type="radio"
            checked={mode==='jsonToExcel'}
            onChange={()=>setMode('jsonToExcel')}
          /> JSON → Excel
        </label>
      </div>

      <div className="uploader">
        <input type="file" accept=".xlsx,.json" onChange={handleFile} />
      </div>

      <div className="status">{msg}</div>
    </div>
  )
}
