/* ==========================================================
   Branş cümleleri — her kategori için 4 cümle.
   Hangi öğretmene hangi cümlenin geleceğini app.js isim
   hash'ine ve branş içindeki sıraya göre belirler.
   ========================================================== */
window.MESSAGES = {
  "Türkçe": [
    "Bir cümlenin ne kadar güzel kurulabileceğini, bir kelimenin ne kadar ağır gelebileceğini bize siz gösterdiniz.",
    "Okuduğumuz her kitabın sayfa kenarında sizin sorduğunuz sorular duruyor hâlâ.",
    "Virgülün yerini öğretirken aslında durup düşünmeyi öğrettiniz. Teşekkürler.",
    "Kendimizi anlatacak kelimeleri bulamadığımız her an, sizin derslerinizden bir şey hatırlıyoruz."
  ],
  "Matematik": [
    "Hayatımızdaki bilinmeyenleri çözmeyi bize siz öğrettiniz; her denklemin bir çözümü olduğunu da.",
    "Yanlış yaptığımız sorudan korkmamayı, işlemi baştan kurmanın cesaret istediğini sizden öğrendik.",
    "Sayıların arasında bir düzen, o düzenin içinde bir güzellik olduğunu bize siz gösterdiniz.",
    "Sabırla tahtaya yazdığınız her adım, bugün attığımız adımların sağlamasıdır."
  ],
  "Fen Bilimleri": [
    "\"Neden?\" diye sormayı bir alışkanlığa dönüştürdünüz; merakımız sizin laboratuvarınızda büyüdü.",
    "Bir tohumun filizlenişinden yıldızların ışığına kadar, dünyaya bakmayı yeniden öğrettiniz.",
    "Deney tüpündeki küçük bir renk değişiminin bile heyecan verici olabileceğini sizinle keşfettik.",
    "Hipotez kurmayı, yanılmayı ve tekrar denemeyi; bilimin en insani yanını bize siz sevdirdiniz."
  ],
  "Sosyal Bilgiler": [
    "Haritaya bakınca sadece çizgileri değil, o çizgilerin arkasındaki insanları görmeyi sizden öğrendik.",
    "Geçmişi ezberlemek yerine anlamayı, bugünü de onunla birlikte okumayı öğrettiniz.",
    "Farklı kültürlere duyduğumuz merak, sizin anlattığınız hikâyelerle başladı.",
    "İyi bir vatandaş olmanın önce iyi bir komşu olmaktan geçtiğini bize siz hatırlattınız."
  ],
  "İngilizce": [
    "Yeni bir dilin aslında yeni bir pencere olduğunu, o pencereyi açmanın cesaret istediğini siz öğrettiniz.",
    "Hata yapa yapa konuşmanın ayıp değil, öğrenmenin ta kendisi olduğunu sizin sınıfınızda anladık.",
    "Dünyanın öbür ucundaki biriyle aynı cümleyi kurabilmenin heyecanını bize siz yaşattınız.",
    "Bazen \"thank you\" demek yetmiyor; o yüzden en içten hâliyle söylüyoruz: her şey için teşekkürler."
  ],
  "Almanca": [
    "Uzun Almanca kelimeleri heceleye heceleye söylerken güldüğümüz o anlar, en güzel derslerimizdi.",
    "Yeni bir dilin kapısını aralarken bize sabrı ve özeni de öğrettiniz. Vielen Dank!",
    "Gramerin bir bulmaca, her cümlenin çözülmeyi bekleyen bir oyun olduğunu sizinle keşfettik.",
    "Bir dili öğrenmenin bir dünyayı tanımak olduğunu bize siz gösterdiniz; Danke für alles."
  ],
  "Din Kültürü": [
    "Saygının, merhametin ve paylaşmanın bir ders konusu değil, bir yaşam biçimi olduğunu bize siz gösterdiniz.",
    "Farklı inançlara ve insanlara anlayışla bakmayı, sorularımızı sabırla dinleyerek öğrettiniz.",
    "Güzel ahlakın en iyi anlatım yolunun örnek olmak olduğunu sizi izleyerek öğrendik.",
    "İyiliğin küçük adımlarla büyüdüğünü, bir tebessümün bile sadaka olduğunu bize hatırlattınız."
  ],
  "Beden Eğitimi": [
    "Düşünce kalkmayı, takım arkadaşına pas vermeyi ve kaybedince de dik durmayı sahada siz öğrettiniz.",
    "Son düdük çalana kadar vazgeçmemeyi bize siz öğrettiniz; bu ders hayatın her maçında işe yarıyor.",
    "Sağlıklı bir bedenin, mutlu bir zihnin ilk adımı olduğunu bize sevdirerek öğrettiniz.",
    "Bir topun etrafında kurulan arkadaşlıkların, sizin sabırlı rehberliğinizle büyüdüğünü biliyoruz."
  ],
  "Yoga": [
    "Derin bir nefesin bazen en büyük cevap olduğunu bize siz hatırlattınız.",
    "Acele eden bir dünyada durmayı, bedenimizi dinlemeyi ve kendimize nazik olmayı sizden öğrendik.",
    "Dengede durmanın önce içeride başladığını, her denemede biraz daha güçlendiğimizi siz gösterdiniz.",
    "Yoğun günlerin ortasında açtığınız o sakin alan, hepimiz için küçük bir mola, büyük bir iyilik."
  ],
  "Astronomi": [
    "Gökyüzüne bakmayı, oradaki her ışığın bir hikâye taşıdığını bize siz öğrettiniz.",
    "Evrenin büyüklüğü karşısında küçülmek yerine merakla büyümeyi sizden öğrendik.",
    "Bir teleskobun ucunda başlayan heyecanın, hayatımız boyunca sürecek bir merak olduğunu gösterdiniz.",
    "Yıldızlara uzanan sorularımızı sabırla dinlediğiniz ve hayallerimize gökyüzü kadar yer açtığınız için teşekkürler."
  ],
  "Drama": [
    "Sahneye çıkmaktan korkan çocuklara, önce kendileri olmayı öğrettiniz; alkışın en büyüğü sizin.",
    "Bir başkasının yerine geçip bakabilmeyi, empatiyi oyunla öğrettiniz.",
    "Doğaçlamada kaybolan replikleri bile bir hikâyeye çevirmeyi, hayatın da böyle olduğunu sizden öğrendik.",
    "Perde kapandığında kalan o sıcak duyguyu, her dersinizden çıkarken de hissettik."
  ],
  "Müzik": [
    "Kalabalık bir sınıfı tek bir şarkıda buluşturmanın sihrini her derste yeniden gösterdiniz.",
    "Doğru notayı bulmak kadar, birbirimizi dinlemenin de müziğin parçası olduğunu sizden öğrendik.",
    "Hayatımızın en güzel anlarına eşlik eden melodilerde sizin öğrettiğiniz bir ritim var.",
    "Susmanın da bir nota olduğunu, sessizliğin müziği güzelleştirdiğini bize siz öğrettiniz."
  ],
  "Görsel Sanatlar": [
    "Bir ağacın bile yüzlerce farklı yeşili olduğunu görmeyi, bakmakla görmek arasındaki farkı siz öğrettiniz.",
    "Kâğıda dökülen her renk lekesine bir anlam bulmayı, hata sanılan çizgiden bir eser çıkarmayı sizden öğrendik.",
    "Hayal gücümüzün sınırı olmadığını bize ilk gösteren, elimize fırçayı veren sizdiniz.",
    "Dünyaya biraz daha renkli bakabiliyorsak, bunda paletinizdeki sabrın payı büyük."
  ],
  "Bilişim Teknolojileri": [
    "Ekranın karşısında sadece tüketen değil, üreten biri olabileceğimizi bize siz gösterdiniz.",
    "Bir hatayı bulmak için satır satır sabretmeyi, hata ayıklamanın hayat dersi olduğunu sizden öğrendik.",
    "Teknolojiyi bilinçli ve güvenli kullanmayı, karmaşık olanı sade anlatarak öğrettiniz.",
    "İlk çalışan kodumuzun heyecanını sizinle paylaşmıştık; o heyecan hâlâ bizimle."
  ],
  "Teknoloji ve Tasarım": [
    "Aklımızdaki fikri önce kâğıda, sonra elimize almayı; ölçüp biçerek üretmeyi siz öğrettiniz.",
    "Bir problemin karşısında söylenmek yerine çözüm tasarlamayı sizin atölyenizde öğrendik.",
    "Cetvelle çizilen her doğru, sizin sabrınızla çekilmiş bir yol gibi.",
    "Küçük bir maketin içine koca bir hayal sığdırabileceğimizi bize siz gösterdiniz."
  ],
  "Rehberlik": [
    "Kendimizi kaybolmuş hissettiğimiz anlarda kapınızın hep açık olduğunu bilmek, en büyük güvencemizdi.",
    "Hiç sormadan anladığınız, yargılamadan dinlediğiniz için teşekkür ederiz.",
    "Ne olmak istediğimizden önce, kim olduğumuzu keşfetmemize yardım ettiniz.",
    "Bir öğrencinin içindeki güzelliği, kendisi bile görmeden önce görebilen o bakış için teşekkürler."
  ],
  "Sınıf Öğretmeni": [
    "Harfleri birleştirip ilk kelimemizi okuduğumuz o anın sevinci, sizin sabrınızın eseridir.",
    "Okula ilk adımımızı attığımız günden beri elimizi tutan, bize okulu sevdiren sizsiniz.",
    "Sınıfı bir aile gibi kurmayı, her çocuğa ayrı ayrı yer açmayı nasıl başardığınıza hâlâ hayranız.",
    "Hayatımızın temelindeki ilk tuğlaları siz koydunuz; üzerine ne inşa edersek sizin izinizi taşıyacak."
  ],
  "Okul Öncesi": [
    "Okulun güvenli ve neşeli bir yer olduğunu, minicik kalplere ilk siz gösterdiniz.",
    "Oyunla öğrenmeyi, renklerle düşünmeyi ve her sabah gülümseyerek gelmeyi bize siz armağan ettiniz.",
    "Bir çocuğun gözündeki 'yaptım!' parıltısının arkasında hep sizin sabırlı ellerinizi görüyoruz.",
    "Küçük adımları büyük sevinçlere dönüştürmeyi, her gün yeniden sevmeyi siz öğrettiniz."
  ],
  "İdare": [
    "Okulumuzun her köşesinde görünmeyen ama hissedilen emeğiniz için teşekkürler.",
    "Bir okulu sadece yönetmeyi değil, ona bir ruh katmayı başardığınız için minnettarız.",
    "Hepimizin işini kolaylaştırmak için üstlendiğiniz yükü biliyoruz ve çok değerli buluyoruz.",
    "Öğretmenin, öğrencinin ve velinin aynı masada buluşabilmesini sağlayan sizsiniz; iyi ki varsınız."
  ],
  "genel": [
    "Bize sadece bilgiyi değil, merakı, sabrı ve iyi insan olmayı da öğrettiniz.",
    "Bugün kim olduysak, biraz da sizin sınıfınızdan aldığımız cesaretle olduk.",
    "Bir öğretmenin etkisinin nerede biteceğini kimse bilemez; sizinki hâlâ devam ediyor.",
    "Emeğiniz, sabrınız ve gülümsemeniz için teşekkür ederiz. İyi ki varsınız."
  ]
};
