import { signOut } from "@/app/admin/actions";
import { LoginForm } from "@/components/admin/LoginForm";
import { Container } from "@/components/ui/Container";

type Props = { searchParams: Promise<{ error?: string }> };

export default async function AdminLoginPage({ searchParams }: Props) {
  const { error } = await searchParams;

  return (
    <Container className="flex max-w-[460px] flex-col gap-6 py-24">
      <div>
        <h1 className="text-[28px] font-extrabold text-navy">Админ</h1>
        <p className="mt-2 text-muted">Мэдээ, ажлын зар, хөдлөх бүрэлдэхүүний мэдээллийг засахын тулд нэвтэрнэ үү.</p>
      </div>

      {error === "forbidden" ? (
        <div className="flex flex-col gap-4 rounded-card border border-ph bg-white p-6">
          <p className="font-semibold text-[#c62828]">Энэ бүртгэлд админ эрх олгогдоогүй байна.</p>
          <form action={signOut}>
            <button type="submit" className="font-semibold text-blue-dark underline">
              Өөр бүртгэлээр нэвтрэх
            </button>
          </form>
        </div>
      ) : (
        <LoginForm />
      )}
    </Container>
  );
}
