import { useState } from "react"

function IndexPopup() {
  const [data, setData] = useState("")

  return (
    <div
      style={{
        width: "300px",
      }}>
      <input onChange={(e) => setData(e.target.value)} value={data} />
    </div>
  )
}

export default IndexPopup
