/* ==========================================================
   Öğretmen listesi
   - branch: rozet ikonu ve övgü cümlesi bu alana göre seçilir
     (ör. "İngilizce", "Okul Öncesi", "Rehberlik", "İdare"...)
   - title : sahnede görünen ünvan (boşsa branch gösterilir)
   - Boş bırakılan görünüm alanlarını avatar.js isimden üretilen
     hash ile tutarlı biçimde kendisi seçer.
   - note  : doluysa sahnede "— Emirhan'dan özel not: …" olarak görünür.
   Değer seçenekleri için avatar.js dosyasının başına bakabilirsin.
   ========================================================== */
window.TEACHERS = [
  { name: "Abdullah Demirtaş", branch: "Drama", title: "Drama Öğretmeni", gender: "E", hairColor: "kahverengi", hairStyle: "kısa", glasses: "yok", facialHair: "sakal", skin: "açık", outfitColor: "lacivert", extra: "kravat", note: "" },
  { name: "Asya Sürekci İren", branch: "Rehberlik", title: "Ortaokul Rehber Öğretmeni", gender: "K", hairColor: "kumral", hairStyle: "uzun düz", glasses: "yok", facialHair: "yok", skin: "açık", outfitColor: "siyah", extra: "küpe kolye", note: "" },
  { name: "Aylin Tuğçe Orhan", branch: "Müzik", title: "Müzik Öğretmeni", gender: "K", hairColor: "kahverengi", hairStyle: "kâkül", glasses: "yok", facialHair: "yok", skin: "açık", outfitColor: "krem", extra: "ruj küpe", note: "" },
  { name: "Ayçin Özyaşar", branch: "Yoga", title: "Yoga Eğitmeni", gender: "K", hairColor: "siyah", hairStyle: "topuz", glasses: "yok", facialHair: "yok", skin: "buğday", outfitColor: "siyah", extra: "", note: "" },
  { name: "Ayşen Arslan", branch: "İngilizce", title: "İngilizce Öğretmeni", gender: "K", hairColor: "sarı", hairStyle: "uzun düz", glasses: "yok", facialHair: "yok", skin: "açık", outfitColor: "somon", extra: "küpe ruj", note: "" },
  { name: "Ayşen Duyal", branch: "Görsel Sanatlar", title: "Resim Öğretmeni", gender: "K", hairColor: "siyah", hairStyle: "kıvırcık", glasses: "yuvarlak", facialHair: "yok", skin: "açık", outfitColor: "lacivert", extra: "kolye", note: "" },
  { name: "Büşra Nur Lale", branch: "Okul Öncesi", title: "Okul Öncesi Öğretmeni", gender: "K", hairColor: "kumral", hairStyle: "uzun dalgalı", glasses: "yok", facialHair: "yok", skin: "buğday", outfitColor: "siyah", extra: "kolye ruj", note: "" },
  { name: "Büşra Yüksel", branch: "Fen Bilimleri", title: "Fen Bilimleri Öğretmeni", gender: "K", hairColor: "siyah", hairStyle: "topuz", glasses: "yok", facialHair: "yok", skin: "açık", outfitColor: "beyaz", extra: "kolye", note: "" },
  { name: "Damla Balbakan", branch: "Türkçe", title: "Türkçe Öğretmeni", gender: "K", hairColor: "kumral", hairStyle: "uzun dalgalı", glasses: "yok", facialHair: "yok", skin: "açık", outfitColor: "siyah", extra: "küpe kolye", note: "" },
  { name: "Demet Acar", branch: "Türkçe", title: "Türkçe Öğretmeni", gender: "K", hairColor: "siyah", hairStyle: "uzun dalgalı", glasses: "yok", facialHair: "yok", skin: "açık", outfitColor: "bordo", extra: "küpe ruj", note: "" },
  { name: "Duygu Omay", branch: "İngilizce", title: "İngilizce Öğretmeni", gender: "K", hairColor: "sarı", hairStyle: "omuz hizası", glasses: "yok", facialHair: "yok", skin: "buğday", outfitColor: "gri", extra: "", note: "" },
  { name: "Ecem Çiçek", branch: "Almanca", title: "Almanca Öğretmeni", gender: "K", hairColor: "siyah", hairStyle: "uzun düz", glasses: "yok", facialHair: "yok", skin: "", outfitColor: "", extra: "", note: "" },
  { name: "Eda Cilasun", branch: "İngilizce", title: "İngilizce Öğretmeni", gender: "K", hairColor: "siyah", hairStyle: "omuz hizası", glasses: "yok", facialHair: "yok", skin: "buğday", outfitColor: "haki", extra: "küpe ruj", note: "" },
  { name: "Emine Altın Alkan", branch: "İngilizce", title: "İngilizce Öğretmeni", gender: "K", hairColor: "kahverengi", hairStyle: "topuz", glasses: "yok", facialHair: "yok", skin: "açık", outfitColor: "pembe", extra: "küpe", note: "" },
  { name: "Fatma Aydan", branch: "Fen Bilimleri", title: "Fen Bilimleri Öğretmeni", gender: "K", hairColor: "siyah", hairStyle: "uzun dalgalı", glasses: "yok", facialHair: "yok", skin: "açık", outfitColor: "siyah", extra: "küpe", note: "" },
  { name: "Fikriye Kocabaş", branch: "İngilizce", title: "İngilizce Öğretmeni", gender: "K", hairColor: "siyah", hairStyle: "uzun düz", glasses: "yok", facialHair: "yok", skin: "açık", outfitColor: "antrasit", extra: "", note: "" },
  { name: "Gülçin Aydar Akbıyık", branch: "İdare", title: "Ortaokul Müdür Yardımcısı", gender: "K", hairColor: "kahverengi", hairStyle: "uzun düz", glasses: "kalın çerçeve", facialHair: "yok", skin: "açık", outfitColor: "beyaz", extra: "", note: "" },
  { name: "Hale Taşkıran", branch: "Sınıf Öğretmeni", title: "Sınıf Öğretmeni", gender: "K", hairColor: "kahverengi", hairStyle: "uzun dalgalı", glasses: "yok", facialHair: "yok", skin: "buğday", outfitColor: "siyah", extra: "", note: "" },
  { name: "Hasan Karamanlı", branch: "Matematik", title: "Matematik Öğretmeni", gender: "E", hairColor: "siyah", hairStyle: "kel", glasses: "yok", facialHair: "sakal", skin: "açık", outfitColor: "gri", extra: "", note: "" },
  { name: "Hatice Tutkaç", branch: "Beden Eğitimi", title: "Beden Eğitimi Öğretmeni", gender: "K", hairColor: "kumral", hairStyle: "uzun düz", glasses: "yok", facialHair: "yok", skin: "buğday", outfitColor: "siyah", extra: "küpe", note: "" },
  { name: "Huriye Arslan Satılmış", branch: "Din Kültürü", title: "Din Kültürü Öğretmeni", gender: "K", hairColor: "", hairStyle: "", glasses: "yok", facialHair: "yok", skin: "açık", outfitColor: "lacivert", extra: "tesettür kolye", note: "" },
  { name: "Kemal Kocamanoğlu", branch: "İngilizce", title: "İngilizce Öğretmeni", gender: "E", hairColor: "kahverengi", hairStyle: "kısa", glasses: "yok", facialHair: "keçi sakalı", skin: "açık", outfitColor: "siyah", extra: "", note: "" },
  { name: "Mehmet Uğur Kutluer", branch: "Sınıf Öğretmeni", title: "Sınıf Öğretmeni", gender: "E", hairColor: "kahverengi", hairStyle: "çok kısa", glasses: "kalın çerçeve", facialHair: "yok", skin: "açık", outfitColor: "bej", extra: "", note: "" },
  { name: "Melis Erkurt", branch: "Sosyal Bilgiler", title: "Sosyal Bilgiler Öğretmeni", gender: "K", hairColor: "sarı", hairStyle: "omuz hizası", glasses: "yok", facialHair: "yok", skin: "açık", outfitColor: "kırmızı", extra: "ruj", note: "" },
  { name: "Merve Taşal", branch: "İdare", title: "İlkokul Müdür Yardımcısı", gender: "K", hairColor: "kahverengi", hairStyle: "kıvırcık", glasses: "yok", facialHair: "yok", skin: "açık", outfitColor: "sarı", extra: "", note: "" },
  { name: "Mustafa Helalpara", branch: "Beden Eğitimi", title: "Basketbol Koçu", gender: "E", hairColor: "gri", hairStyle: "çok kısa", glasses: "yok", facialHair: "yok", skin: "açık", outfitColor: "gri", extra: "", note: "" },
  { name: "Münevver Tıkaç", branch: "Rehberlik", title: "İlkokul Rehber Öğretmeni", gender: "K", hairColor: "siyah", hairStyle: "uzun düz", glasses: "yok", facialHair: "yok", skin: "açık", outfitColor: "bordo", extra: "", note: "" },
  { name: "Nevriye Şentürk", branch: "Sınıf Öğretmeni", title: "Sınıf Öğretmeni", gender: "K", hairColor: "kumral", hairStyle: "omuz hizası", glasses: "var", facialHair: "yok", skin: "açık", outfitColor: "lacivert", extra: "", note: "" },
  { name: "Rümeysa Özarslan Parmak", branch: "Okul Öncesi", title: "Okul Öncesi Öğretmeni", gender: "K", hairColor: "siyah", hairStyle: "uzun düz", glasses: "yok", facialHair: "yok", skin: "açık", outfitColor: "beyaz", extra: "ruj", note: "" },
  { name: "Sevde Gündem", branch: "Okul Öncesi", title: "Okul Öncesi Öğretmeni", gender: "K", hairColor: "kumral", hairStyle: "uzun düz", glasses: "yok", facialHair: "yok", skin: "açık", outfitColor: "krem", extra: "küpe", note: "" },
  { name: "Sevi Şeneken", branch: "İdare", title: "Genel Koordinatör", gender: "K", hairColor: "kahverengi", hairStyle: "uzun düz", glasses: "yok", facialHair: "yok", skin: "açık", outfitColor: "beyaz", extra: "", note: "" },
  { name: "Sıla Alparslan", branch: "Okul Öncesi", title: "Okul Öncesi Öğretmeni", gender: "K", hairColor: "siyah", hairStyle: "uzun düz", glasses: "yok", facialHair: "yok", skin: "açık", outfitColor: "kahverengi", extra: "küpe ruj", note: "" },
  { name: "Tansel Hamidoğulları", branch: "Müzik", title: "Müzik Öğretmeni", gender: "E", hairColor: "gri", hairStyle: "kısa", glasses: "var", facialHair: "yok", skin: "buğday", outfitColor: "lacivert", extra: "", note: "" },
  { name: "Tayfun Taşkıran", branch: "Matematik", title: "Matematik Öğretmeni", gender: "E", hairColor: "kahverengi", hairStyle: "kısa", glasses: "yok", facialHair: "kirli sakal", skin: "açık", outfitColor: "bej", extra: "", note: "" },
  { name: "Tuğçe Torun", branch: "İdare", title: "Kampüs Müdürü", gender: "K", hairColor: "siyah", hairStyle: "uzun düz", glasses: "yok", facialHair: "yok", skin: "açık", outfitColor: "siyah", extra: "kolye küpe", note: "" },
  { name: "Yağmur Tekirdağ", branch: "Sınıf Öğretmeni", title: "Sınıf Öğretmeni", gender: "K", hairColor: "", hairStyle: "", glasses: "yok", facialHair: "yok", skin: "açık", outfitColor: "gülkurusu", extra: "tesettür", note: "" },
  { name: "Yıldırım Baytekin", branch: "İdare", title: "Kurucu", gender: "E", hairColor: "siyah", hairStyle: "kısa", glasses: "yok", facialHair: "kirli sakal", skin: "buğday", outfitColor: "lacivert", extra: "", note: "" }
];
