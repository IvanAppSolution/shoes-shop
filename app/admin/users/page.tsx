"use client";
import UsersTable from "@/components/admin/users-table";
import SidePanel from "../side-panel";

export default function Users() {
	return (
        <SidePanel>
          <div className="no-scrollbar flex-1 flex flex-col justify-between">
            <div className="w-full md:p-10 p-4">
              <UsersTable />
            </div>
          </div>
          
        </SidePanel>
	);
}