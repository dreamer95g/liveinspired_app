import React, { useState, useEffect, useMemo } from "react";
import { Table, Input, Space, Button, Tag } from "antd";
// import Highlighter from "react-highlight-words";
import { SearchOutlined } from "@ant-design/icons";

export const TagTable = ({ tagsList, setSelectedIds }) => {
  let searchInput = "";

  const handleReset = (clearFilters) => {
    clearFilters();
    setState({ searchText: "" });
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            searchInput = node;
          }}
          placeholder={`Búsqueda`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Buscar
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Limpiar
          </Button>
        </Space>
      </div>
    ),

    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),

    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",

    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.select(), 100);
      }
    },

    render: (text) => {
      return text;
    },
  });

  const columns = [
    {
      title: "Palabras Clave",
      dataIndex: "name",
      ...getColumnSearchProps("name"),
      defaultSortOrder: "descend",
      sorter: (a, b) => a.name.length - b.name.length,
    },
  ];

  const [data, setData] = useState([]);

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      // console.table(
      //   `selectedRowKeys: ${selectedRowKeys}`,
      //   "selectedRows: ",
      //   selectedRows
      // );

      if (selectedRows.length !== 0) {
        let selecteds = [];
        selectedRows.forEach((element) => {
          const { key } = element;
          // console.log(key);

          selecteds.push(parseInt(key));
        });

        setSelectedIds(selecteds);
      }
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === "Disabled User",
      // Column configuration not to be checked
      name: record.name,
    }),
  };

  const selectionType = "checkbox";

  const initialState = {
    searchText: "",
    searchedColumn: "",
  };

  const [state, setState] = useState(initialState);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();

    setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  function onChange(pagination, filters, sorter, extra) {
    // console.table("params", pagination, filters, sorter, extra);
  }

  useEffect(() => {
    if (tagsList !== undefined) {
      setData(tagsList);
      // console.table(data);
    }

    return () => {
      setData([]);
    };
  }, [tagsList]);

  return (
    <div>
      <Table
        rowSelection={{
          type: selectionType,
          ...rowSelection,
        }}
        columns={columns}
        dataSource={data}
        onChange={onChange}
      />
    </div>
  );
};
