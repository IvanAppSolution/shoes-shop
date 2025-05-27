"use client";
import { parseAsInteger, useQueryState, parseAsString } from "nuqs";
import React, { useState, useEffect } from 'react';
import { Input } from "./input";
import { Button } from "./button";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface ProductsFilterProps {
  className?: string;
}

export default function ProductsFilter({className}:ProductsFilterProps) {
  const [inputSearch, setInputSearch] = useState('');
  const [timeoutId, setTimeoutId] = useState('');
  const [isLoading, startTransition] = React.useTransition()

  const [search, setSearch] = useQueryState(
    "search",
    parseAsString
      .withDefault("")
      .withOptions({ startTransition, shallow: false,clearOnDefault: true })
  );

  // const [perPage, setPerPage] = useQueryState(
  //   "perPage",
  //   parseAsInteger.withDefault(10)
  // );

  // // set offset = 1 as default for 1st page.
  const [offset, setOffset] = useQueryState(
    "offset",
    parseAsInteger.withDefault(1),
  );

  const [page, setPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(1)
    .withOptions({ startTransition })
  );

  const handleSearch = (value: string) => {
    
      setInputSearch(value);    
      clearTimeout(timeoutId);

      const newTimeoutId = setTimeout(() => {
        if (value.length > 1) {
          setSearch(value);
        } else if (value.length === 0) {
          setSearch(value);
        }
        setOffset(0)
        setPage(1)
      }, 600);

      setTimeoutId(String(newTimeoutId));
    
  };

  const handleClear = () => {
    setSearch("");
    setInputSearch("");
    setOffset(0)
    setPage(1)
  }

  


  useEffect(() => {
    return () => clearTimeout(timeoutId);
  }, [timeoutId]);


  return (
    <div className={`flex justify-between gap-3 ${className}`}>
      <div className="flex gap-2">
        <Input
          placeholder="Search"
          className=""
          value={inputSearch}
          onChange={(e) => handleSearch(e.target.value)}
        />
         {isLoading ? <Image alt="loading" src="/images/loading.gif" width="40" height="40" /> : <Button variant={"secondary"} onClick={() => handleClear()}>Clear</Button>}
      </div>
    </div>
  );
}