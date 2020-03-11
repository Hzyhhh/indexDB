import React, { useState, useEffect } from "react";
import { Table, Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Demo } from "./container";

import useDatabaseModel from "./container/indexDB";

import "./App.css";

const { confirm } = Modal;

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
  const DB = useDatabaseModel("gzb", 1);
  const [value, setValue] = useState();

  const handleClick = r => {
    confirm({
      title: "Tips",
      icon: <ExclamationCircleOutlined />,
      content: "Do you Want to delete?",
      async onOk() {
        await DB.delete(r.id);
        const list = await DB.readAll();
        list && setValue(list);
      }
    });
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
      render: r => <a onClick={() => handleClick(r)}>删除</a>
    });
  }, []);

  return (
    <div className="wrapper">
      <Demo onChange={setValue} />
      <Table id="id" size="small" dataSource={value} columns={columns} />
    </div>
  );
}

export default App;
