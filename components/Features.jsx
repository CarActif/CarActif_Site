export default function Features() {
  const items = [
    { emoji: "🔐", title: "Paiement sécurisé" },
    { emoji: "📞", title: "Accompagnement humain" },
    { emoji: "📷", title: "Photos professionnelles" },
    { emoji: "🚗", title: "Voitures vérifiées" },
  ];
  return (
    <section className="py-12 px-6">
      <h2 className="text-2xl font-semibold text-center mb-8 text-[#316D49]">Pourquoi choisir CarActif ?</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {items.map((item, i) => (
          <div key={i} className="bg-white bg-opacity-70 rounded-lg p-4 shadow text-center">
            <div className="text-3xl mb-2">{item.emoji}</div>
            <p className="text-md font-medium text-gray-800">{item.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
