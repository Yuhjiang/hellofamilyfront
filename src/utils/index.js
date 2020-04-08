import {Button, Input, DatePicker} from "antd";
import {SearchOutlined} from "@ant-design/icons";
import React from "react";

export const clearTokensAndUserInfo = () => {
  window.localStorage.removeItem("authToken");
  window.localStorage.removeItem("refreshToken");
  window.localStorage.removeItem("userInfo");
  window.sessionStorage.removeItem("authToken");
  window.sessionStorage.removeItem("refreshToken");
  window.sessionStorage.removeItem("userInfo");
};

export const getColumnSearchProps = (displayTitle, dataIndex, searchInput, handleSearch, handleReset) => ({
  filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
    <div style={{padding: 8}}>
      <Input
        ref={node => {
          searchInput = node;
        }}
        placeholder={`搜索${displayTitle[dataIndex]}`}
        value={selectedKeys[0]}
        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
        onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
        style={{width: 188, marginBottom: 8, display: 'block'}}
      />
      <Button
        type="primary"
        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
        icon={<SearchOutlined/>}
        size="small"
        style={{width: 90, marginRight: 8}}
      >
        搜索
      </Button>
      <Button onClick={() => handleReset(clearFilters)} size="small"
              style={{width: 90}}>
        取消
      </Button>
    </div>
  ),
  filterIcon: filtered => <SearchOutlined
    style={{color: filtered ? '#1890ff' : undefined}}/>,
  onFilterDropdownVisibleChange: visible => {
    if (visible) {
      setTimeout(() => searchInput.select());
    }
  },
});

export const getColumnDateSearchProps = (displayTitle, dataIndex, handleDateSearch, handleDateReset) => ({
  filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
    <div style={{padding: 8}}>
      <DatePicker.RangePicker
        allowClear
        onChange={(dates, dateStrings) => {
          if (dates) {
            setSelectedKeys(dateStrings);
          } else {
            clearFilters();
            handleDateReset(clearFilters);
          }
        }}
        style={{marginRight: 8}}
      />
      <Button
        type="primary"
        onClick={() => handleDateSearch(selectedKeys, confirm, dataIndex)}
      >
        搜索
      </Button>
    </div>
  ),
  filterIcon: filtered => <SearchOutlined
    style={{color: filtered ? "#1890ff" : undefined}}
  />,
});