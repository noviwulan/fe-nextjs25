"use client";

import { useEffect, useState } from "react";

export default function TestAPI() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/v1/category-product")
      .then((res) => res.json())
      .then((json) => setData(json.data));
  }, []);

  return (
    <div>
      <h1>Test API Category</h1>
      <ul>
        {data.map((item:any) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}
