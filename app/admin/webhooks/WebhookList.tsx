"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface WebhookLog {
  id: number;
  type: string;
  status: string;
  payload: string;
  error: string | null;
  requestHeaders: string | null;
  requestBody: string | null;
  responseStatus: number | null;
  responseBody: string | null;
  processingTimeMs: number | null;
  createdAt: Date;
}

interface WebhookListProps {
  logs: WebhookLog[];
}

export default function WebhookList({ logs: initialLogs }: WebhookListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedLog, setSelectedLog] = useState<WebhookLog | null>(null);

  const filteredLogs = initialLogs.filter((log) => {
    const matchesSearch = 
      log.payload.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.requestBody?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.responseBody?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || log.status === statusFilter;
    const matchesType = typeFilter === "all" || log.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const formatJson = (jsonString: string | null) => {
    if (!jsonString) return "";
    try {
      return JSON.stringify(JSON.parse(jsonString), null, 2);
    } catch {
      return jsonString;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Search in payload..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="sm:w-[300px]"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="success">Success</SelectItem>
            <SelectItem value="error">Error</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="payment">Payment</SelectItem>
            <SelectItem value="subscription">Subscription</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Response Status</TableHead>
            <TableHead>Processing Time</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredLogs.map((log) => (
            <TableRow key={log.id}>
              <TableCell>
                {format(new Date(log.createdAt), 'yyyy-MM-dd HH:mm:ss')}
              </TableCell>
              <TableCell>
                <Badge variant="outline">{log.type}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant={log.status === 'success' ? 'default' : 'destructive'}>
                  {log.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={log.responseStatus === 200 ? 'default' : 'destructive'}>
                  {log.responseStatus}
                </Badge>
              </TableCell>
              <TableCell>
                {log.processingTimeMs ? `${log.processingTimeMs}ms` : 'N/A'}
              </TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedLog(log)}
                    >
                      View Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>Webhook Details</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="h-[600px] w-full rounded-md border p-4">
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold mb-2">Request Headers</h3>
                          <pre className="bg-muted p-2 rounded-md overflow-x-auto">
                            {formatJson(log.requestHeaders)}
                          </pre>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">Request Body</h3>
                          <pre className="bg-muted p-2 rounded-md overflow-x-auto">
                            {formatJson(log.requestBody)}
                          </pre>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">Response Body</h3>
                          <pre className="bg-muted p-2 rounded-md overflow-x-auto">
                            {formatJson(log.responseBody)}
                          </pre>
                        </div>
                        {log.error && (
                          <div>
                            <h3 className="font-semibold mb-2 text-destructive">Error</h3>
                            <pre className="bg-muted p-2 rounded-md overflow-x-auto text-destructive">
                              {log.error}
                            </pre>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 