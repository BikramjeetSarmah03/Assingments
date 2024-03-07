import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/useModal";
import { Input } from "@/components/ui/input";
import { Label } from "../ui/label";
import LoadingButton from "../ui/loading-button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllUsers } from "@/services/users";
import { useState } from "react";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { isAxiosError } from "axios";

export function MeetingModal() {
  const { isOpen, type, onClose } = useModal();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const isModalOpen = isOpen && type === "meeting";
  const [formData, setFormData] = useState({
    id: "",
    email: "",
    time: "",
  });

  const getUsers = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
  });

  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedIndex = event.target.selectedIndex;
    const selectedItem = event.target.options[selectedIndex];
    const mail = selectedItem.getAttribute("data-useremail");

    setFormData({
      ...formData,
      id: selectedItem.value,
      email: mail || "",
    });
  };

  const handleTime = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      time: event.target.value,
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (formData.id === "") return toast.error("Please select an user");
    if (formData.time === "") return toast.error("Please select an time");

    try {
      setLoading(true);
      const res = await api.post("/meeting", formData);

      if (!res.data.success) throw new Error("Error while scheduling meeting");

      toast.success("Meeting Scheduled");
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message);
      } else {
        toast.error("Error while scheduling meeting");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Schedule a meeting</DialogTitle>
          <DialogDescription>
            Schedule a meeting with the user in Zoom. An email with the schedule
            and meeting link will be sent to you and the user
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label id="user">Select User</Label>
            <select
              onChange={handleSelect}
              id="user"
              className="p-2 bg-white border rounded-md">
              <option value="">Select User</option>
              {getUsers.data?.success &&
                getUsers.data?.users &&
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                getUsers.data.users.map((user: any) => (
                  <option
                    value={user.id}
                    key={user.id}
                    data-useremail={user.email}>
                    {user.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="">
            <Label htmlFor="email">Email</Label>
            <Input value={formData.email} id="email" placeholder="Email" />
          </div>

          <div>
            <Label htmlFor="dateTime">Select Date and Time</Label>
            <Input id="dateTime" type="datetime-local" onChange={handleTime} />
          </div>

          <LoadingButton loading={loading} type="submit" className="w-full">
            Schedule Meeting
          </LoadingButton>
        </form>
      </DialogContent>
    </Dialog>
  );
}
