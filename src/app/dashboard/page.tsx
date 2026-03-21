"use client";

import { signOut, useSession } from "@/lib/auth/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DashboardPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  if (isPending) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div>Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const mockPayments = [
    {
      id: "1",
      title: "Netflix Subscription",
      amount: "$15.99",
      dueDate: "2024-04-01",
      status: "completed",
      category: "Entertainment",
    },
    {
      id: "2",
      title: "Electric Bill",
      amount: "$89.50",
      dueDate: "2024-03-25",
      status: "pending",
      category: "Utilities",
    },
    {
      id: "3",
      title: "Internet Bill",
      amount: "$59.99",
      dueDate: "2024-03-20",
      status: "overdue",
      category: "Utilities",
    },
    {
      id: "4",
      title: "Gym Membership",
      amount: "$49.99",
      dueDate: "2024-04-05",
      status: "pending",
      category: "Health",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "#34A853";
      case "pending":
        return "#FBBC05";
      case "overdue":
        return "#EA4335";
      default:
        return "#999";
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case "completed":
        return "rgba(52, 168, 83, 0.1)";
      case "pending":
        return "rgba(251, 188, 5, 0.1)";
      case "overdue":
        return "rgba(234, 67, 53, 0.1)";
      default:
        return "rgba(153, 153, 153, 0.1)";
    }
  };

  const completedCount = mockPayments.filter(
    p => p.status === "completed",
  ).length;
  const pendingCount = mockPayments.filter(p => p.status === "pending").length;
  const overdueCount = mockPayments.filter(p => p.status === "overdue").length;
  const totalAmount = mockPayments.reduce(
    (sum, p) => sum + parseFloat(p.amount.replace("$", "")),
    0,
  );

  const categories = Array.from(new Set(mockPayments.map(p => p.category)));
  const statuses = ["pending", "completed", "overdue"];

  const filteredPayments = mockPayments.filter(payment => {
    const categoryMatch =
      !selectedCategory || payment.category === selectedCategory;
    const statusMatch = !selectedStatus || payment.status === selectedStatus;
    return categoryMatch && statusMatch;
  });

  const handleLogout = async () => {
    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/auth");
          },
        },
      });
    } catch (error) {
      console.error("Google sign-in error:", error);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0b0e1a 0%, #1a1e30 100%)",
        padding: "40px 20px",
        fontFamily: "'DM Sans', sans-serif",
        color: "#e8e6e1",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700&family=DM+Sans:wght@400;500;600&display=swap"
        rel="stylesheet"
      />

      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "40px",
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontFamily: "'Playfair Display', serif",
                fontSize: "36px",
                fontWeight: 700,
                marginBottom: "8px",
              }}
            >
              Dashboard
            </h1>
            <p style={{ margin: 0, color: "#7a7872", fontSize: "14px" }}>
              Welcome back, manage your payments
            </p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              padding: "10px 20px",
              background: "rgba(201, 162, 39, 0.2)",
              border: "1px solid #c9a227",
              borderRadius: "8px",
              color: "#c9a227",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif",
              transition: "all 0.3s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "#c9a227";
              e.currentTarget.style.color = "#0b0e1a";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "rgba(201, 162, 39, 0.2)";
              e.currentTarget.style.color = "#c9a227";
            }}
          >
            Sign Out
          </button>
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "16px",
            padding: "24px",
            marginBottom: "32px",
            display: "flex",
            alignItems: "center",
            gap: "24px",
            backdropFilter: "blur(24px)",
          }}
        >
          {session.user.image && (
            <img
              src={session.user.image}
              alt={session.user.name || "User"}
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                border: "2px solid #c9a227",
              }}
            />
          )}
          <div>
            <h2
              style={{ margin: "0 0 8px 0", fontSize: "24px", fontWeight: 600 }}
            >
              {session.user.name || "User"}
            </h2>
            <p style={{ margin: 0, color: "#7a7872", fontSize: "14px" }}>
              {session.user.email}
            </p>
            <p
              style={{
                margin: "8px 0 0 0",
                color: "#c9a227",
                fontSize: "12px",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              Verified User
            </p>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              background: "rgba(52, 168, 83, 0.1)",
              border: "1px solid rgba(52, 168, 83, 0.3)",
              borderRadius: "12px",
              padding: "20px",
              backdropFilter: "blur(24px)",
            }}
          >
            <p
              style={{
                margin: "0 0 12px 0",
                color: "#7a7872",
                fontSize: "12px",
                textTransform: "uppercase",
              }}
            >
              Completed
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "28px",
                fontWeight: 700,
                color: "#34A853",
              }}
            >
              {completedCount}
            </p>
          </div>

          <div
            style={{
              background: "rgba(251, 188, 5, 0.1)",
              border: "1px solid rgba(251, 188, 5, 0.3)",
              borderRadius: "12px",
              padding: "20px",
              backdropFilter: "blur(24px)",
            }}
          >
            <p
              style={{
                margin: "0 0 12px 0",
                color: "#7a7872",
                fontSize: "12px",
                textTransform: "uppercase",
              }}
            >
              Pending
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "28px",
                fontWeight: 700,
                color: "#FBBC05",
              }}
            >
              {pendingCount}
            </p>
          </div>

          <div
            style={{
              background: "rgba(234, 67, 53, 0.1)",
              border: "1px solid rgba(234, 67, 53, 0.3)",
              borderRadius: "12px",
              padding: "20px",
              backdropFilter: "blur(24px)",
            }}
          >
            <p
              style={{
                margin: "0 0 12px 0",
                color: "#7a7872",
                fontSize: "12px",
                textTransform: "uppercase",
              }}
            >
              Overdue
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "28px",
                fontWeight: 700,
                color: "#EA4335",
              }}
            >
              {overdueCount}
            </p>
          </div>

          <div
            style={{
              background: "rgba(201, 162, 39, 0.1)",
              border: "1px solid rgba(201, 162, 39, 0.3)",
              borderRadius: "12px",
              padding: "20px",
              backdropFilter: "blur(24px)",
            }}
          >
            <p
              style={{
                margin: "0 0 12px 0",
                color: "#7a7872",
                fontSize: "12px",
                textTransform: "uppercase",
              }}
            >
              Total Amount
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "28px",
                fontWeight: 700,
                color: "#c9a227",
              }}
            >
              ${totalAmount.toFixed(2)}
            </p>
          </div>
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "16px",
            overflow: "hidden",
            backdropFilter: "blur(24px)",
          }}
        >
          <div
            style={{
              padding: "24px",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <h2
              style={{
                margin: "0 0 24px 0",
                fontSize: "20px",
                fontWeight: 600,
                fontFamily: "'Playfair Display', serif",
              }}
            >
              Total Payments
            </h2>

            <div
              style={{
                display: "flex",
                gap: "16px",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => {
                    setShowCategoryDropdown(!showCategoryDropdown);
                    setShowStatusDropdown(false);
                  }}
                  style={{
                    padding: "10px 16px",
                    background: selectedCategory
                      ? "rgba(201, 162, 39, 0.3)"
                      : "rgba(255,255,255,0.05)",
                    border: selectedCategory
                      ? "1px solid #c9a227"
                      : "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    color: selectedCategory ? "#c9a227" : "#e8e6e1",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: 600,
                    transition: "all 0.2s",
                    fontFamily: "'DM Sans', sans-serif",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background =
                      "rgba(201, 162, 39, 0.2)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = selectedCategory
                      ? "rgba(201, 162, 39, 0.3)"
                      : "rgba(255,255,255,0.05)";
                  }}
                >
                  <span>
                    📁 Category{" "}
                    {selectedCategory ? `(${selectedCategory})` : ""}
                  </span>
                  <span
                    style={{
                      transform: showCategoryDropdown
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                      transition: "transform 0.2s",
                    }}
                  >
                    ▼
                  </span>
                </button>

                {showCategoryDropdown && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      marginTop: "8px",
                      background: "rgba(11, 14, 26, 0.95)",
                      border: "1px solid rgba(201, 162, 39, 0.3)",
                      borderRadius: "12px",
                      backdropFilter: "blur(24px)",
                      minWidth: "200px",
                      maxHeight: "300px",
                      overflowY: "auto",
                      zIndex: 1000,
                      boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                    }}
                  >
                    <button
                      onClick={() => {
                        setSelectedCategory(null);
                        setShowCategoryDropdown(false);
                      }}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        background: !selectedCategory
                          ? "rgba(201, 162, 39, 0.2)"
                          : "transparent",
                        border: "none",
                        borderBottom: "1px solid rgba(255,255,255,0.05)",
                        color: !selectedCategory ? "#c9a227" : "#e8e6e1",
                        cursor: "pointer",
                        fontSize: "13px",
                        fontWeight: 600,
                        textAlign: "left",
                        transition: "all 0.2s",
                        fontFamily: "'DM Sans', sans-serif",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background =
                          "rgba(201, 162, 39, 0.15)";
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = !selectedCategory
                          ? "rgba(201, 162, 39, 0.2)"
                          : "transparent";
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={!selectedCategory}
                        readOnly
                        style={{ cursor: "pointer" }}
                      />
                      All Categories
                    </button>
                    {categories.map(category => (
                      <button
                        key={category}
                        onClick={() => {
                          setSelectedCategory(category);
                          setShowCategoryDropdown(false);
                        }}
                        style={{
                          width: "100%",
                          padding: "12px 16px",
                          background:
                            selectedCategory === category
                              ? "rgba(201, 162, 39, 0.2)"
                              : "transparent",
                          border: "none",
                          borderBottom: "1px solid rgba(255,255,255,0.05)",
                          color:
                            selectedCategory === category
                              ? "#c9a227"
                              : "#e8e6e1",
                          cursor: "pointer",
                          fontSize: "13px",
                          fontWeight: 600,
                          textAlign: "left",
                          transition: "all 0.2s",
                          fontFamily: "'DM Sans', sans-serif",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background =
                            "rgba(201, 162, 39, 0.15)";
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background =
                            selectedCategory === category
                              ? "rgba(201, 162, 39, 0.2)"
                              : "transparent";
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedCategory === category}
                          readOnly
                          style={{ cursor: "pointer" }}
                        />
                        {category}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ position: "relative" }}>
                <button
                  onClick={() => {
                    setShowStatusDropdown(!showStatusDropdown);
                    setShowCategoryDropdown(false);
                  }}
                  style={{
                    padding: "10px 16px",
                    background: selectedStatus
                      ? "rgba(201, 162, 39, 0.3)"
                      : "rgba(255,255,255,0.05)",
                    border: selectedStatus
                      ? "1px solid #c9a227"
                      : "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    color: selectedStatus ? "#c9a227" : "#e8e6e1",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: 600,
                    transition: "all 0.2s",
                    fontFamily: "'DM Sans', sans-serif",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background =
                      "rgba(201, 162, 39, 0.2)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = selectedStatus
                      ? "rgba(201, 162, 39, 0.3)"
                      : "rgba(255,255,255,0.05)";
                  }}
                >
                  <span>
                    ⚡ Status {selectedStatus ? `(${selectedStatus})` : ""}
                  </span>
                  <span
                    style={{
                      transform: showStatusDropdown
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                      transition: "transform 0.2s",
                    }}
                  >
                    ▼
                  </span>
                </button>

                {showStatusDropdown && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      marginTop: "8px",
                      background: "rgba(11, 14, 26, 0.95)",
                      border: "1px solid rgba(201, 162, 39, 0.3)",
                      borderRadius: "12px",
                      backdropFilter: "blur(24px)",
                      minWidth: "200px",
                      maxHeight: "300px",
                      overflowY: "auto",
                      zIndex: 1000,
                      boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                    }}
                  >
                    <button
                      onClick={() => {
                        setSelectedStatus(null);
                        setShowStatusDropdown(false);
                      }}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        background: !selectedStatus
                          ? "rgba(201, 162, 39, 0.2)"
                          : "transparent",
                        border: "none",
                        borderBottom: "1px solid rgba(255,255,255,0.05)",
                        color: !selectedStatus ? "#c9a227" : "#e8e6e1",
                        cursor: "pointer",
                        fontSize: "13px",
                        fontWeight: 600,
                        textAlign: "left",
                        transition: "all 0.2s",
                        fontFamily: "'DM Sans', sans-serif",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background =
                          "rgba(201, 162, 39, 0.15)";
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = !selectedStatus
                          ? "rgba(201, 162, 39, 0.2)"
                          : "transparent";
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={!selectedStatus}
                        readOnly
                        style={{ cursor: "pointer" }}
                      />
                      All Statuses
                    </button>
                    {statuses.map(status => (
                      <button
                        key={status}
                        onClick={() => {
                          setSelectedStatus(status);
                          setShowStatusDropdown(false);
                        }}
                        style={{
                          width: "100%",
                          padding: "12px 16px",
                          background:
                            selectedStatus === status
                              ? "rgba(201, 162, 39, 0.2)"
                              : "transparent",
                          border: "none",
                          borderBottom: "1px solid rgba(255,255,255,0.05)",
                          color:
                            selectedStatus === status ? "#c9a227" : "#e8e6e1",
                          cursor: "pointer",
                          fontSize: "13px",
                          fontWeight: 600,
                          textAlign: "left",
                          textTransform: "capitalize",
                          transition: "all 0.2s",
                          fontFamily: "'DM Sans', sans-serif",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background =
                            "rgba(201, 162, 39, 0.15)";
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background =
                            selectedStatus === status
                              ? "rgba(201, 162, 39, 0.2)"
                              : "transparent";
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedStatus === status}
                          readOnly
                          style={{ cursor: "pointer" }}
                        />
                        {status}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <th
                    style={{
                      padding: "16px 24px",
                      textAlign: "left",
                      color: "#7a7872",
                      fontSize: "12px",
                      fontWeight: 600,
                      textTransform: "uppercase",
                    }}
                  >
                    Payment
                  </th>
                  <th
                    style={{
                      padding: "16px 24px",
                      textAlign: "left",
                      color: "#7a7872",
                      fontSize: "12px",
                      fontWeight: 600,
                      textTransform: "uppercase",
                    }}
                  >
                    Amount
                  </th>
                  <th
                    style={{
                      padding: "16px 24px",
                      textAlign: "left",
                      color: "#7a7872",
                      fontSize: "12px",
                      fontWeight: 600,
                      textTransform: "uppercase",
                    }}
                  >
                    Due Date
                  </th>
                  <th
                    style={{
                      padding: "16px 24px",
                      textAlign: "left",
                      color: "#7a7872",
                      fontSize: "12px",
                      fontWeight: 600,
                      textTransform: "uppercase",
                    }}
                  >
                    Category
                  </th>
                  <th
                    style={{
                      padding: "16px 24px",
                      textAlign: "left",
                      color: "#7a7872",
                      fontSize: "12px",
                      fontWeight: 600,
                      textTransform: "uppercase",
                    }}
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.length > 0 ? (
                  filteredPayments.map(payment => (
                    <tr
                      key={payment.id}
                      style={{
                        borderBottom: "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      <td style={{ padding: "16px 24px", fontSize: "14px" }}>
                        <Link
                          href={`/dashboard/${payment.id}`}
                          className="hover:underline"
                        >
                          {payment.title}
                        </Link>
                      </td>
                      <td
                        style={{
                          padding: "16px 24px",
                          fontSize: "14px",
                          fontWeight: 600,
                        }}
                      >
                        {payment.amount}
                      </td>
                      <td
                        style={{
                          padding: "16px 24px",
                          fontSize: "14px",
                          color: "#7a7872",
                        }}
                      >
                        {payment.dueDate}
                      </td>
                      <td style={{ padding: "16px 24px", fontSize: "14px" }}>
                        <span
                          style={{
                            background: "rgba(201, 162, 39, 0.1)",
                            border: "1px solid rgba(201, 162, 39, 0.3)",
                            padding: "4px 12px",
                            borderRadius: "6px",
                            fontSize: "12px",
                            color: "#c9a227",
                          }}
                        >
                          {payment.category}
                        </span>
                      </td>
                      <td style={{ padding: "16px 24px" }}>
                        <span
                          style={{
                            background: getStatusBg(payment.status),
                            border: `1px solid ${getStatusColor(payment.status)}`,
                            padding: "6px 12px",
                            borderRadius: "6px",
                            fontSize: "12px",
                            color: getStatusColor(payment.status),
                            fontWeight: 600,
                            textTransform: "capitalize",
                          }}
                        >
                          {payment.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      style={{
                        padding: "32px 24px",
                        textAlign: "center",
                        color: "#7a7872",
                        fontSize: "14px",
                      }}
                    >
                      No payments found matching the selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
