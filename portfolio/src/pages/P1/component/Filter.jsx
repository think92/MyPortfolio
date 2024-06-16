import React from "react";

const Filter = ({
  searchTerm,
  selectType,
  onSearchtermChange,
  onselectTypeChange,
  onSearch,
  selectOptons,
}) => {
  return (
    <div className="buttonss">
      <div></div>
      <div className="seletes">
        <select
          name="select"
          className="select"
          value={selectType}
          onChange={onselectTypeChange}
        >
          <option value="">- 항목 -</option>
          {selectOptons.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="검색어를 입력하세요"
          value={searchTerm}
          onChange={onSearchtermChange}
        />
        <button className="delete" onClick={onSearch}>
          검색
        </button>
      </div>
    </div>
  );
};

export default Filter;
