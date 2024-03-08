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
    date: "",
    time: "",
    topic: "",
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

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (formData.topic === "") return toast.error("Please enter a topic");
    if (formData.id === "") return toast.error("Please select an user");
    if (formData.date === "") return toast.error("Please select an date");
    if (formData.time === "")
      return toast.error("Please select duration of the meeting");

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
          <div>
            <Label htmlFor="topic">Topic</Label>
            <Input
              id="topic"
              name="topic"
              placeholder="Please enter a topic"
              onChange={handleInputChange}
            />
          </div>

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
            <Label htmlFor="date">Select Date and Time</Label>
            <Input
              id="date"
              name="date"
              type="datetime-local"
              onChange={handleInputChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="time">Select Duration</Label>
            <select
              name="time"
              id="time"
              className="p-2 bg-white border rounded-md"
              onChange={handleInputChange}>
              <option value="">Duration</option>
              <option value="5">5 min</option>
              <option value="15">15 min</option>
              <option value="30">30 min</option>
              <option value="40">40 min</option>
            </select>
          </div>

          <LoadingButton loading={loading} type="submit" className="w-full">
            Schedule Meeting
          </LoadingButton>
        </form>
      </DialogContent>
    </Dialog>
  );
}
