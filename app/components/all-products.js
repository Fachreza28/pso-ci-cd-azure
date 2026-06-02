"use client";
import React, { useEffect, useMemo, useState } from "react";
import DataTable from "@/app/components/dataTable";

const cols = ["ID", "TITLE", "DESCRIPTION", "PRICE", "TAGS"];

const AllProducts = () => {
  const [rows, setRows] = useState([]);
  const [sortOrder, setSortOrder] = useState("none");

  useEffect(() => {
    async function getAllProducts() {
      try {
        const res = await fetch("/api/");
        if (!res.ok) {
          throw new Error("Error fetching products");
        }

        const { products } = await res.json();
        setRows(products);
      } catch (error) {
        console.log("Error fetching products", error);
      }
    }
    getAllProducts();
  }, []);

  const sortedRows = useMemo(() => {
    if (sortOrder === "none") return rows;
    return [...rows].sort((a, b) => {
      const aTag = (a.tags || []).join(", ");
      const bTag = (b.tags || []).join(", ");
      return sortOrder === "asc"
        ? aTag.localeCompare(bTag)
        : bTag.localeCompare(aTag);
    });
  }, [rows, sortOrder]);

  return (
    <div>
      <div className="mb-3 d-flex align-items-center gap-3">
        <label className="mb-0" htmlFor="tagSortSelect">
          Sort by tags:
        </label>
        <select
          id="tagSortSelect"
          className="form-select w-auto"
          value={sortOrder}
          onChange={(event) => setSortOrder(event.target.value)}
        >
          <option value="none">None</option>
          <option value="asc">Tags A &rarr; Z</option>
          <option value="desc">Tags Z &rarr; A</option>
        </select>
      </div>
      <DataTable cols={cols} rows={sortedRows} />
    </div>
  );
};

export default AllProducts;
