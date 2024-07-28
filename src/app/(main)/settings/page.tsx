import { ModeToggle } from "@/components/themeSwitch";
import { Button } from "@/components/ui/button";
import DeleteAccountButton from "@/features/user/deleteAccountButton";

function SettingsPage() {
  return (
    <>
      <main className="mx-auto max-w-screen-lg p-8">
        <h1 className="mb-12 text-3xl font-bold tracking-tighter">Settings</h1>

        <h2 className="font-semibold">Appearance</h2>
        <div className="mt-3 rounded-xl border">
          <div className="flex items-center justify-between p-8">
            <h3 className="">Theme</h3>

            <ModeToggle />
          </div>
        </div>

        <h2 className="mt-12 font-semibold">Account and privacy</h2>
        <div className="mt-3 rounded-xl border">
          <div className="flex items-center justify-between p-8">
            <div>
              <h3 className="font-semibold">Delete your account</h3>
              <p className="text-muted-foreground">
                This will delete all your data and cannot be undone.
              </p>
            </div>

            <DeleteAccountButton />
          </div>
        </div>
      </main>
    </>
  );
}

export default SettingsPage;
