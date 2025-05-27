"use client";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination"
import { useQueryState, parseAsInteger } from "nuqs";
import { Button } from "./button";
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Select } from "@radix-ui/react-select";
import { SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./select";
import { AppContext } from "../context";
import { useContext } from "react";

interface ProductsPaginationProps {
  searchResultCount: number;
  refetchProducts: () => Promise<void>;
}

export default function ProductsPagination( { searchResultCount,  refetchProducts } :  ProductsPaginationProps) {
  const {defaultPerPage} = useContext(AppContext);
  // console.log('ProductsPagination-searchResultCount', searchResultCount)
  const [offset, setOffset] = useQueryState(
    "offset",
    parseAsInteger.withDefault(0),
  );

  const [perPage, setPerPage] = useQueryState(
    "perPage",
    parseAsInteger.withDefault(defaultPerPage)
  );

  const [page, setPage] = useQueryState( 
    "page",
    parseAsInteger.withDefault(1)
  );


  const handlePageChange = (value: number) => {
    console.log('handlePageChange-value: ', value)
    console.log('page: ', page)
    setOffset(perPage * ( value-1));
    setPage(value)
    setTimeout(() => {
      refetchProducts();
    }, 300);
  }

  const numPages = Math.ceil(searchResultCount / perPage);
  console.log('perPage: ', perPage)
  console.log('numPages: ', numPages)

  const handlePerPageChange = (value: string) => {
    setPerPage(Number(value));
    setTimeout(() => {
      refetchProducts();
      setOffset(0)
      setPage(1)
    }, 300);
  };
  
  return (
    <div className="flex items-stretch "> 
      <Pagination className="py-4 ">
        <PaginationContent>
          {page > 1 && (
              <PaginationItem>
                <Button
                  variant={"outline"}
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 0}
                >
                  <ChevronLeft className="size-4" >Previous</ChevronLeft>
                </Button>
              </PaginationItem>
            )}
          {page  <= numPages && (
            <>
            {Array.from({ length: numPages }, (_, i) => (
              <PaginationItem key={i}>
                  <Button
                    key={i}
                    variant={"outline"}
                    onClick={() => handlePageChange(i + 1)}
                    disabled={page-1 === i}
                  >
                    {i + 1}
                </Button>  
              </PaginationItem>
            ))}
            </>
          )}

        {page < numPages && ( 
          <PaginationItem>
              <Button
                variant={"outline"}
                onClick={() => handlePageChange(page + 1)}
                disabled={page === 0}
              >
                <ChevronRight className="size-4" >Next</ChevronRight>
              </Button>
          </PaginationItem>
        )}
        
        </PaginationContent>
        <div className="ml-10">
          <Select
            value={perPage.toString()}
            onValueChange={(value) => handlePerPageChange(value)}
          >
            <SelectTrigger className="w-20">
              <SelectValue placeholder="Per Page" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Per Page</SelectLabel>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="30">30</SelectItem>
              </SelectGroup>  
            </SelectContent>
          </Select>
        </div>
      </Pagination>
   
        
       
    </div>
  )
}