import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link } from "@inertiajs/react"
import { useState } from "react"

export function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(""); // Clear any previous errors

    if (!firstName || !lastName || !email || !password || !phoneNumber || !role) {
      setError("All fields are required.");
      return;
    }

    // Example of posting the form data to the backend
    try {
      const response = await fetch(`/Auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          phoneNumber,
          role,
        }),
      });

      if (!response.ok) {
        throw new Error("Registration failed. Please try again.");
      }

      const data = await response.json(); // Await the response JSON
      console.log("Login successful:", data);
      // Assuming the token is in data.token
      const token = data.token;  // Replace 'token' with the actual field name from your API response
      const user = data.user;  // Replace 'token' with the actual field name from your API response

      // Save the token to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      document.cookie = `token=${token}; path=/;`;

      // Optionally, set the login state in the app (you can update your user context or global state here)
      // Example:
      // setIsAuthenticated(true);

      // Redirect the user to another page, if needed
      // For example, redirecting to the home page:
      window.location.href = "/dashboard";
      // console.log("Registration successful!");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    }
    
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Register</CardTitle>
          <CardDescription>
            Enter your username phone email password  below to Register to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              {/* First Name Field */}
              <div className="grid gap-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First Name"
                  required
                />
              </div>

              {/* Last Name Field */}
              <div className="grid gap-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last Name"
                  required
                />
              </div>

              {/* Email Field */}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="m@example.com"
                  required
                />
              </div>

              {/* Phone Number Field */}
              <div className="grid gap-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="097779797"
                  required
                />
              </div>

              {/* Password Field */}
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* Role Field */}
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Admin/User"
                  required
                />
              </div>

              {/* Displaying errors */}
              {error && (
                <div className="mt-2 text-red-500 text-sm">{error}</div>
              )}

              {/* Submit Button */}
              <Button type="submit" className="w-full">
                Register
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Have an account?{" "}
              <Link href="/admin/login" className="underline underline-offset-4">
                Sign In
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
