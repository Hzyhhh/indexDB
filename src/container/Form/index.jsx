import React, { useState, useEffect } from "react";
import { Table, message, Popconfirm } from "antd";
import { FormItems } from "./Form";

import useDatabaseModel from "../indexDB";

import "./style.css";

const columns = [
  {
    title: "姓名",
    dataIndex: "name",
    key: "name"
  },
  {
    title: "生日",
    dataIndex: "birthDate",
    key: "birthDate"
  },
  {
    title: "住址",
    dataIndex: "address",
    key: "address"
  }
];

function App() {
  const DB = useDatabaseModel("info", 2);
  const [value, setValue] = useState();

  const handleClick = async r => {
    try {
      await DB.delete(r.id);
      const list = await DB.readAll();
      list && setValue(list);
    } catch (error) {
      message.error(error);
    }
  };

  useEffect(() => {
    // 这里因为useEffect内不能用async/await所以写成这样
    DB.onReady().then(() => {
      DB.readAll().then(list => {
        setValue(list);
      });
    });

    columns.push({
      title: "操作",
      align: "center",
      render: r => (
        <Popconfirm title="Sure to delete?" onConfirm={() => handleClick(r)}>
          <a>删除</a>
        </Popconfirm>
      )
    });
  }, []);

  return (
    <div className="wrapper">
      <FormItems onChange={setValue} />
      <Table
        id="id"
        rowClassName={() => "editable-row"}
        size="small"
        dataSource={value}
        columns={columns}
      />
    </div>
  );
}

export default App;
