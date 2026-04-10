import PageShell from "../(marketing)/page-shell";

export default function PrivacyPage() {
  return (
    <PageShell
      title="Privacy Policy"
      subtitle="A simple overview of how SciSeek handles information."
    >
      <>
         <div className="space-y-6">
           <section>
             <h2 className="text-lg font-semibold text-white">Information Collected</h2>
             <p className="mt-2">
               SciSeek may collect information you provide directly, such as questions,
               feedback, or messages.
             </p>
           </section>
         
           <section>
             <h2 className="text-lg font-semibold text-white">Usage Data</h2>
             <p className="mt-2">
               We may collect basic technical information such as device type, browser,
               and usage patterns to improve the product.
             </p>
           </section>
         
           <section>
             <h2 className="text-lg font-semibold text-white">How Data Is Used</h2>
             <p className="mt-2">
               Data is used to operate, improve, and monitor SciSeek. We do not sell your
               personal information.
             </p>
           </section>
         
           <section>
             <h2 className="text-lg font-semibold text-white">Updates</h2>
             <p className="mt-2">
               This policy may change as the product evolves.
             </p>
           </section>
         </div>
      </>
    </PageShell>
  );
}