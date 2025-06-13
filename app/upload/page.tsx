"use client";

import { If } from "@/components/custom/condition";
import { DocumentTable } from "@/components/custom/document-table";
import { UploadDocument } from "@/components/custom/upload-documet";
import { LoginForm } from "@/components/form/login";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/auth-context";

export default function Component() {
  const { user } = useAuth();

  return (
    <main className="pb-16">
      <If
        condition={!user}
        Then={
          <div
            className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex justify-center items-start py-40 z-50"
            style={{ backdropFilter: "blur(5px)" }}
          >
            <LoginForm />
          </div>
        }
      />

      <Tabs
        defaultValue="upload"
        className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Tải lên tệp tin</TabsTrigger>
          <TabsTrigger value="list">Danh sách tệp tin</TabsTrigger>
        </TabsList>

        <TabsContent value="upload">
          <Card>
            <CardHeader>
              <CardTitle>Tải lên tệp tin</CardTitle>
              <CardDescription>
                Điền thông tin và chọn tệp tin để tải lên hệ thống.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UploadDocument />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Danh sách tệp tin</CardTitle>
              <CardDescription>
                Danh sách các tệp tin đã được tải lên hệ thống.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DocumentTable />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
