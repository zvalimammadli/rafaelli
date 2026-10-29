/* Rafaelli — çərçivə kataloqu
   Mənbə: Xətai Sənət Mərkəzi, "Taxta çərçivələr" (xsm.az/taxta-cerciveler), 29.10.2026.
   w = profilin eni (mm), d = profilin hündürlüyü (mm) — kataloqdakı "Ölçü w×d mm".
   Görünüş kataloq şəkillərinə baxılaraq təsvir edilib:
     color   — əsas rəng            accent — naxış / kənar rəngi
     finish  — mat | lak | metal | mermer | patina
     pattern — burma (spiral) | ornament (barokko naxış) | muncuq (muncuq sırası) — yoxdursa yazılmır
     lip     — inner (daxili kənar zolağı) | outer (xarici kənar zolağı)
     profile — flat | rounded | cove (çökük) | stepped (pilləli)
     fam     — rəng qrupu (süzgəc üçün): qizili | gumusu | qara | krem | qehveyi | rengli
     price   — 1 metr profilin qiyməti, AZN (HƏLƏLİK FƏRZİ — Xətai Sənət Mərkəzinin real qiymətləri ilə əvəz edilməlidir)
   Göstərilməməli çərçivə üçün "hidden: true" yazın. */
/* Qiymət hesablaması (fərzi):
   çərçivə = uzunluq (m, künc kəsimləri daxil: 2×(en+hündürlük) + 8×profil eni) × 1 metr qiyməti + iş haqqı
   paspartu = paspartunun sahəsi (m²) × m² qiyməti + kəsim haqqı */
window.RAFAELLI_FRAME_PRICING = { labor: 8, matPerM2: 45, matCut: 5, estimate: true };
window.RAFAELLI_FRAMES = [
  { code: "5576", w: 46,  d: 22, price: 29, fam: "qizili",  az: "Qızılı burma",            en: "Gold twist",               color: "#b08a45", accent: "#3f3624", finish: "metal",  pattern: "burma",    profile: "rounded" },
  { code: "5575", w: 46,  d: 22, price: 29, fam: "gumusu",  az: "Gümüşü burma",            en: "Silver twist",             color: "#bdb8a6", accent: "#5c5a4e", finish: "metal",  pattern: "burma",    profile: "rounded" },
  { code: "5561", w: 59,  d: 14, price: 26, fam: "qara",    az: "Qara mat",                en: "Matte black",              color: "#22231d", finish: "mat",    profile: "flat" },
  { code: "5559", w: 59,  d: 14, price: 26, fam: "qara",    az: "Qara, qızılı kənar",      en: "Black with gold edge",     color: "#22231d", accent: "#a8853f", finish: "mat",    lip: "outer", profile: "flat" },
  { code: "5524", w: 59,  d: 14, price: 26, fam: "krem",    az: "Krem",                    en: "Cream",                    color: "#cfc3a5", finish: "lak",    profile: "flat" },
  { code: "5523", w: 59,  d: 14, price: 26, fam: "krem",    az: "Bej",                     en: "Beige",                    color: "#bfb294", finish: "lak",    profile: "flat" },
  { code: "5520", w: 64,  d: 50, price: 37, fam: "gumusu",  az: "Gümüşü ornament",         en: "Silver ornament",          color: "#938d70", accent: "#d2ccb0", finish: "metal",  pattern: "ornament", profile: "stepped" },
  { code: "5519", w: 64,  d: 50, price: 38, fam: "qehveyi", az: "Bürünc ornament",         en: "Bronze ornament",          color: "#5b3a22", accent: "#a07a3c", finish: "patina", pattern: "ornament", profile: "stepped" },
  { code: "5517", w: 75,  d: 50, price: 30, fam: "qehveyi", az: "Qırmızı-qəhvəyi",         en: "Red-brown",                color: "#713c20", accent: "#b08c48", finish: "lak",    lip: "inner", profile: "rounded" },
  { code: "5516", w: 75,  d: 50, price: 30, fam: "qehveyi", az: "Qəhvəyi, zeytuni kənar",  en: "Brown, olive-gold edge",   color: "#7a4526", accent: "#9a924e", finish: "lak",    lip: "inner", profile: "rounded" },
  { code: "5515", w: 75,  d: 50, price: 34, fam: "qehveyi", az: "Terrakota",               en: "Terracotta",               color: "#8c4226", accent: "#b38f4c", finish: "patina", lip: "inner", profile: "rounded" },
  { code: "5549", w: 80,  d: 70, price: 37, fam: "qizili",  az: "Qızılı mərmər",           en: "Gold marble",              color: "#b49a66", accent: "#5f6b45", finish: "mermer", profile: "rounded" },
  { code: "5548", w: 80,  d: 70, price: 37, fam: "krem",    az: "Açıq mərmər",             en: "Light marble",             color: "#cdb98e", accent: "#8a9868", finish: "mermer", profile: "rounded" },
  { code: "5512", w: 86,  d: 80, price: 40, fam: "qizili",  az: "Şampan qızılı, muncuqlu", en: "Champagne gold, beaded",   color: "#b3ab7a", accent: "#e2dbb0", finish: "metal",  pattern: "muncuq",   profile: "stepped" },
  { code: "5511", w: 86,  d: 80, price: 43, fam: "qizili",  az: "Zeytuni qızılı ornament", en: "Olive-gold ornament",      color: "#a3964f", accent: "#d8cc86", finish: "metal",  pattern: "ornament", profile: "stepped" },
  { code: "5514", w: 89,  d: 43, price: 44, fam: "qizili",  az: "Qızılı barokko",          en: "Gold baroque",             color: "#b8993c", accent: "#efd98a", finish: "metal",  pattern: "ornament", profile: "stepped" },
  { code: "5510", w: 89,  d: 59, price: 45, fam: "qizili",  az: "Antik qızılı",            en: "Antique gold",             color: "#8c7a40", accent: "#c4ad6a", finish: "patina", pattern: "ornament", profile: "stepped" },
  { code: "5536", w: 91,  d: 35, price: 39, fam: "rengli",  az: "Firuzəyi, qızıl yarpaq",  en: "Teal with gold leaf",      color: "#1f5a48", accent: "#c09a44", finish: "patina", profile: "flat" },
  { code: "5534", w: 91,  d: 35, price: 39, fam: "qizili",  az: "Qızılı-gümüşü patina",    en: "Gold-silver patina",       color: "#ab966a", accent: "#ddd0aa", finish: "patina", profile: "flat" },
  { code: "5541", w: 93,  d: 40, price: 38, fam: "qizili",  az: "Şampan qızılı, fırçalı",  en: "Brushed champagne gold",   color: "#aca06a", finish: "metal",  profile: "cove" },
  { code: "5509", w: 110, d: 47, price: 50, fam: "qizili",  az: "Parlaq qızılı barokko",   en: "Bright gold baroque",      color: "#c7a34c", accent: "#f2df9a", finish: "metal",  pattern: "ornament", profile: "stepped" },
  { code: "5545", w: 118, d: 47, price: 46, fam: "rengli",  az: "Tünd yaşıl, qızılı muncuq", en: "Dark green, gold bead",  color: "#313c1c", accent: "#b8923e", finish: "lak",    pattern: "muncuq", lip: "outer", profile: "cove" },
  { code: "5506", w: 138, d: 77, price: 57, fam: "qizili",  az: "Qızılı barokko, krem daxil", en: "Gold baroque, cream inner", color: "#b08a40", accent: "#f0d78e", finish: "metal", pattern: "ornament", lip: "inner", lipColor: "#dcd1b4", profile: "stepped" },
  { code: "5504", w: 138, d: 77, price: 54, fam: "qehveyi", az: "Tünd qəhvəyi, qızılı barokko", en: "Dark brown, gold baroque", color: "#3b2519", accent: "#b08c46", finish: "lak", pattern: "ornament", profile: "stepped" },
  { code: "5501", w: 138, d: 77, price: 54, fam: "krem",    az: "Fil sümüyü, qızılı ornament", en: "Ivory, gold ornament",  color: "#dbd1ba", accent: "#b08a40", finish: "lak",    pattern: "ornament", profile: "stepped" }
];
