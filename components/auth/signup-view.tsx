import Link from "next/link";
import { BadgeCheck } from "lucide-react";

import { AuthShell } from "@/components/auth/auth-shell";
import { CtaButton } from "@/components/home/cta-button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function SignupView() {
  return (
    <AuthShell
      eyebrow="Create Account"
      title="Signup is available only for customers."
      description="Create your user account to save wishlist items, manage orders, and speed up checkout. Admin access is not created from signup."
      accentLabel="User Registration"
      accentTitle="Customer-only signup"
      accentDescription="Admin roles are handled separately. This page is only for storefront users creating their own account."
    >
      <Card className="auth-card py-0 shadow-none">
        <CardContent className="auth-card-content">
          <div className="auth-card-head">
            <p className="eyebrow">Signup</p>
            <h2>Create your user account</h2>
            <p>Register as a customer and start saving products, tracking orders, and checking out faster.</p>
          </div>

          <div className="auth-role-pill is-user-only">
            <BadgeCheck className="size-4" /> User role only
          </div>

          <form className="auth-form">
            <div className="auth-two-col-grid">
              <label className="auth-field">
                <span>First Name</span>
                <Input type="text" placeholder="Aarav" />
              </label>
              <label className="auth-field">
                <span>Last Name</span>
                <Input type="text" placeholder="Sharma" />
              </label>
            </div>

            <label className="auth-field">
              <span>Email Address</span>
              <Input type="email" placeholder="you@example.com" />
            </label>

            <label className="auth-field">
              <span>Phone Number</span>
              <Input type="tel" placeholder="+91 98765 43210" />
            </label>

            <div className="auth-two-col-grid">
              <label className="auth-field">
                <span>Password</span>
                <Input type="password" placeholder="Create a password" />
              </label>
              <label className="auth-field">
                <span>Confirm Password</span>
                <Input type="password" placeholder="Repeat your password" />
              </label>
            </div>

            <label className="auth-checkbox-row">
              <input type="checkbox" />
              <span>I agree to the store terms and privacy policy.</span>
            </label>

            <CtaButton type="submit" className="auth-submit-button">
              Create User Account
            </CtaButton>
          </form>

          <div className="auth-footnote-block">
            <p>
              Already have an account? <Link href="/login" className="auth-inline-link">Login here</Link>
            </p>
            <p>Admin access is not created on signup. Admins use the same login page and their role is detected automatically from the account.</p>
          </div>
        </CardContent>
      </Card>
    </AuthShell>
  );
}