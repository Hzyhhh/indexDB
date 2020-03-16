import React from "react";
import { Form, Input, Select, Tooltip, Button, DatePicker } from "antd";
import moment from "moment";
import useDatabaseModel from "./indexDB";

const { Option } = Select;

export const Demo = props => {
  const DB = useDatabaseModel("info", 2);
  const { onChange } = props;

  const handleSubmit = async values => {
    if (onChange) {
      const params = {
        name: values.username,
        province: values.address.province,
        address: values.address.province + values.address.street,
        birthDate: moment(values.year).format("YYYY-MM-DD")
      };
      await DB.add(params);
      const list = await DB.readAll();

      if (list) {
        onChange(list);
      }
    }
  };

  return (
    <Form
      name="complex-form"
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 10 }}
      onFinish={handleSubmit}
    >
      <Form.Item>
        <Button type="primary" htmlType="submit">
          提交
        </Button>
      </Form.Item>
      <Form.Item label="Username">
        <Form.Item
          name="username"
          noStyle
          rules={[{ required: true, message: "Username is required" }]}
        >
          <Input style={{ width: 160 }} placeholder="Please input" />
        </Form.Item>
        <Tooltip title="Useful information">
          <a href="#API" style={{ marginLeft: 8 }}>
            Need Help?
          </a>
        </Tooltip>
      </Form.Item>

      <Form.Item label="Address">
        <Input.Group compact>
          <Form.Item
            name={["address", "province"]}
            noStyle
            rules={[{ required: true, message: "Province is required" }]}
          >
            <Select placeholder="Select province">
              <Option value="Zhejiang">Zhejiang</Option>
              <Option value="Jiangsu">Jiangsu</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name={["address", "street"]}
            noStyle
            rules={[{ required: true, message: "Street is required" }]}
          >
            <Input style={{ width: "50%" }} placeholder="Input street" />
          </Form.Item>
        </Input.Group>
      </Form.Item>

      <Form.Item label="BirthDate" style={{ marginBottom: 0 }}>
        <Form.Item
          name="year"
          rules={[{ required: true }]}
          style={{
            display: "inline-block",
            width: "calc(50% - 5px)",
            marginRight: 8
          }}
        >
          <DatePicker />
        </Form.Item>
      </Form.Item>
    </Form>
  );
};

export default Demo;
