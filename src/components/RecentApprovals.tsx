import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuthStore } from "../store/authStore";

// Interface for credit requests
interface CreditRequest {
  id: string;
  user_id: string;
  amount: number;
  status: string;
  created_at: string;
  approved_by: string | null;
  admin_name: string | null;
}

// Interface for Supabase raw response (with correct alias)
interface RawCreditRequest {
  id: string;
  user_id: string;
  amount: number;
  status: string;
  created_at: string;
  approved_by: string | null;
  approved_by_user?: { email: string } | null;
}

export function RecentApprovals() {
  const { role } = useAuthStore();
  const [approvedRequests, setApprovedRequests] = useState<CreditRequest[]>([]);

  useEffect(() => {
    if (role !== "admin") return;

    async function fetchApprovedRequests() {
      const { data, error } = (await supabase.from("credit_requests").select(`
          id,
          user_id,
          amount,
          status,
          created_at,
          approved_by,
          approved_by_user:profiles(email)
        `)) as unknown as { data: RawCreditRequest[]; error: any };

      if (error) {
        console.error("Error fetching approved requests:", error.message);
      } else {
        const requests = (data as RawCreditRequest[]).map((req) => ({
          id: req.id,
          user_id: req.user_id,
          amount: req.amount,
          status: req.status,
          created_at: req.created_at,
          approved_by: req.approved_by,
          admin_name: req.approved_by_user?.email ?? "Unknown Admin",
        }));
        setApprovedRequests(requests);
      }
    }

    fetchApprovedRequests();

    // Real-time subscription for new approvals
    const subscription = supabase
      .channel("approved_credit_requests")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "credit_requests" },
        async (payload) => {
          if (payload.new.status === "approved") {
            const { data: adminData, error: adminError } = await supabase
              .from("profiles")
              .select<{ email: string }>("email")
              .eq("id", payload.new.approved_by)
              .single();

            if (adminError) {
              console.error("Error fetching admin data:", adminError.message);
            }

            const newRequest: CreditRequest = {
              id: payload.new.id,
              user_id: payload.new.user_id,
              amount: payload.new.amount,
              status: payload.new.status,
              created_at: payload.new.created_at,
              approved_by: payload.new.approved_by,
              admin_name: adminData?.email ?? "Unknown Admin",
            };

            setApprovedRequests((prev) => [
              newRequest,
              ...prev.slice(0, 9), // Keep top 10
            ]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [role]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">Recent Approved Credit Requests</h2>
      {role !== "admin" ? (
        <p>Access denied. Admin only.</p>
      ) : approvedRequests.length === 0 ? (
        <p>No recent approved requests</p>
      ) : (
        <table className="w-full mt-4 border">
          <thead>
            <tr>
              <th className="border p-2">User ID</th>
              <th className="border p-2">Amount</th>
              <th className="border p-2">Approved By</th>
              <th className="border p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {approvedRequests.map((req) => (
              <tr key={req.id} className="border">
                <td className="border p-2">{req.user_id}</td>
                <td className="border p-2">{req.amount}</td>
                <td className="border p-2">{req.admin_name}</td>
                <td className="border p-2">
                  {new Date(req.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
