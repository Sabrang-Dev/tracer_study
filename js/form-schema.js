/**
 * form-schema.js
 * SINGLE SOURCE OF TRUTH for the questionnaire.
 * Extracted verbatim from the official Tracer Study PDF.
 *
 * To update the questionnaire in the future, edit ONLY this file.
 * The renderer builds the entire UI dynamically from this schema.
 *
 * Field object shape:
 * {
 *   id:        unique field id (uses the PDF question code where available)
 *   code:      the PDF question code (kode pertanyaan)
 *   number:    the PDF question number (or null for sub-fields / identity fields)
 *   group:     JSON output group used on submit
 *   label:     exact question wording from the PDF
 *   description: helper text from the PDF (or "")
 *   type:      text | email | tel | number | date | textarea | radio | checkbox | select | likert | matrix
 *   required:  boolean (validated only when the field is visible)
 *   options:   [{ value, label }]  (verbatim answer options)
 *   condition: null | { field, op, value }  op: eq | neq | in | includes
 *   todo:      true when the PDF does NOT contain the dropdown values (placeholder only)
 *   full:      render full width (spans 2 columns on desktop)
 * }
 */

/* ---------- Reusable option sets (verbatim from PDF) ---------- */

const SCALE_1_5 = [
  { value: "1", label: "1 - Sangat Rendah" },
  { value: "2", label: "2 - Rendah" },
  { value: "3", label: "3 - Sedang" },
  { value: "4", label: "4 - Tinggi" },
  { value: "5", label: "5 - Sangat Tinggi" },
];

const LIKERT_BESAR = [
  { value: "1", label: "Sangat Besar" },
  { value: "2", label: "Besar" },
  { value: "3", label: "Cukup Besar" },
  { value: "4", label: "Kurang Besar" },
  { value: "5", label: "Tidak Sama Sekali" },
];

/* ---------- Schema ---------- */

window.FORM_SCHEMA = {
  meta: {
    title: "Kuesioner Tracer Study",
    scaleCompetency: SCALE_1_5,
  },

  sections: [
    /* ============================================================= */
    /* 1. IDENTITAS ALUMNI                                            */
    /* ============================================================= */
    {
      id: "identity",
      title: "Identitas Alumni",
      icon: "user",
      description: "Data diri dan informasi akademik alumni.",
      fields: [
        {
          id: "nimhsmsmh",
          code: "nimhsmsmh",
          number: null,
          group: "identity",
          label: "NIM",
          description: "",
          type: "text",
          required: false,
          condition: null,
        },
        {
          id: "kdptimsmh",
          code: "kdptimsmh",
          number: null,
          group: "identity",
          label: "Kode PT",
          description: "",
          type: "text",
          required: false,
          condition: null,
        },
        {
          id: "tahun_lulus",
          code: "tahun_lulus",
          number: null,
          group: "identity",
          label: "Tahun Lulus",
          description: "",
          type: "number",
          required: false,
          condition: null,
        },
        {
          id: "kdpstmsmh",
          code: "kdpstmsmh",
          number: null,
          group: "identity",
          label: "Kode Prodi",
          description: "",
          type: "text",
          required: false,
          condition: null,
        },
        {
          id: "nmmhsmsmh",
          code: "nmmhsmsmh",
          number: null,
          group: "identity",
          label: "Nama",
          description: "",
          type: "text",
          required: false,
          condition: null,
          full: true,
        },
        {
          id: "telpomsmh",
          code: "telpomsmh",
          number: null,
          group: "identity",
          label: "Nomor Telepon/HP",
          description: "",
          type: "tel",
          required: true,
          condition: null,
        },
        {
          id: "emailmsmh",
          code: "emailmsmh",
          number: null,
          group: "identity",
          label: "Alamat Email",
          description: "",
          type: "email",
          required: true,
          condition: null,
        },
        {
          id: "nik",
          code: "nik",
          number: null,
          group: "identity",
          label: "NIK",
          description: "",
          type: "text",
          required: false,
          condition: null,
        },
        {
          id: "npwp",
          code: "npwp",
          number: null,
          group: "identity",
          label: "NPWP",
          description: "",
          type: "text",
          required: false,
          condition: null,
        },
        {
          id: "f8",
          code: "f8",
          number: 1,
          group: "identity",
          label: "Jelaskan status Anda saat ini?",
          description: "",
          type: "radio",
          required: true,
          full: true,
          condition: null,
          options: [
            { value: "1", label: "Bekerja (full time / part time)" },
            { value: "2", label: "Belum memungkinkan bekerja" },
            { value: "3", label: "Wiraswasta" },
            { value: "4", label: "Melanjutkan Pendidikan" },
            { value: "5", label: "Tidak kerja tetapi sedang mencari kerja" },
          ],
        },
      ],
    },

    /* ============================================================= */
    /* 2. INFORMASI PEKERJAAN                                         */
    /* ============================================================= */
    {
      id: "employment",
      title: "Informasi Pekerjaan",
      icon: "briefcase",
      description: "Bagian ini ditampilkan jika Anda Bekerja atau Wiraswasta.",
      fields: [
        {
          id: "f502_work",
          code: "f502",
          number: 2,
          group: "employment",
          label: "Dalam berapa bulan Anda mendapatkan pekerjaan pertama?",
          description: "Jika Memilih Bekerja",
          type: "number",
          required: true,
          full: true,
          condition: { field: "f8", op: "eq", value: "1" },
        },
        {
          id: "f502_wira",
          code: "f502",
          number: 2,
          group: "entrepreneur",
          label: "Dalam berapa bulan setelah lulus anda memulai wiraswasta ?",
          description: "Jika Memilih Wiraswasta",
          type: "number",
          required: true,
          full: true,
          condition: { field: "f8", op: "eq", value: "3" },
        },
        {
          id: "f505",
          code: "f505",
          number: 3,
          group: "employment",
          label: "Berapa rata-rata pendapatan Anda per bulan?",
          description: "take home pay",
          type: "number",
          required: true,
          full: true,
          condition: { field: "f8", op: "in", value: ["1", "3"] },
        },
        {
          id: "f5a1",
          code: "f5a1",
          number: 4,
          group: "employment",
          label: "Provinsi",
          description: "Dimana lokasi tempat Anda bekerja?",
          type: "text",
          required: true,
          condition: { field: "f8", op: "in", value: ["1", "3"] },
        },
        {
          id: "f5a2",
          code: "f5a2",
          number: null,
          group: "employment",
          label: "Kota/Kabupaten",
          description: "",
          type: "text",
          required: true,
          condition: { field: "f8", op: "in", value: ["1", "3"] },
        },
        {
          id: "f1101",
          code: "f1101",
          number: 5,
          group: "employment",
          label:
            "Apa jenis perusahaan/intansi/institusi tempat anda bekerja sekarang?",
          description: "",
          type: "radio",
          required: true,
          full: true,
          condition: { field: "f8", op: "in", value: ["1", "3"] },
          options: [
            { value: "1", label: "Intansi pemerintah" },
            { value: "6", label: "BUMN/BUMD" },
            { value: "7", label: "Institusi/Organisasi Multilateral" },
            {
              value: "2",
              label: "Organisasi non-profit/Lembaga Swadaya Masyarakat",
            },
            { value: "3", label: "Perusahaan swasta" },
            { value: "4", label: "Wiraswasta/perusahaan sendiri" },
            { value: "5", label: "Lainnya, tuliskan" },
          ],
        },
        {
          id: "f1102",
          code: "f1102",
          number: null,
          group: "employment",
          label: "Lainnya, tuliskan",
          description: "",
          type: "text",
          required: false,
          full: true,
          condition: { field: "f1101", op: "eq", value: "5" },
        },
        {
          id: "f5b",
          code: "f5b",
          number: 6,
          group: "employment",
          label: "Apa nama perusahaan/kantor tempat Anda bekerja?",
          description: "",
          type: "text",
          required: true,
          full: true,
          condition: { field: "f8", op: "in", value: ["1", "3"] },
        },
        {
          id: "f5c",
          code: "f5c",
          number: 7,
          group: "entrepreneur",
          label: "Bila berwiraswasta, apa posisi/jabatan Anda saat ini?",
          description: "Apabila menjawab [3] wiraswasta",
          type: "radio",
          required: false,
          todo: true,
          full: true,
          condition: { field: "f8", op: "eq", value: "3" },
          options: [
            { value: "1", label: "Founder/Pendiri" },
            { value: "2", label: "Co-Founder/Pendiri Bersama" },
            { value: "3", label: "Owner/Pemilik" },
            { value: "4", label: "Partner/Sekutu" },
            { value: "5", label: "Direktur" },
            { value: "6", label: "Manajer" },
            { value: "7", label: "Freelancer/Pekerja Mandiri" },
            { value: "8", label: "Lainnya" },
          ],
        },
        {
          id: "f5c_other",
          code: "f5c_other",
          number: null,
          group: "entrepreneur",
          label: "Lainnya, tuliskan",
          type: "text",
          required: false,
          full: true,
          condition: { field: "f5c", op: "eq", value: "8" },
        },
        {
          id: "f5d",
          code: "f5d",
          number: 8,
          group: "employment",
          label: "Apa tingkat tempat kerja Anda?",
          type: "radio",
          required: true,
          full: true,
          condition: { field: "f8", op: "in", value: ["1", "3"] },
          options: [
            {
              value: "1",
              label: "Lokal/Wilayah/Wiraswasta tidak berbadan hukum",
            },
            { value: "2", label: "Nasional/Wiraswasta berbadan hukum" },
            { value: "3", label: "Multinasional/Internasional" },
            { value: "4", label: "Lainnya" },
          ],
        },
        {
          id: "f5d_other",
          code: "f5d_other",
          group: "employment",
          label: "Sebutkan tingkat tempat kerja lainnya",
          type: "text",
          required: false,
          full: true,
          condition: {
            field: "f5d",
            op: "eq",
            value: "4",
          },
        },
      ],
    },

    /* ============================================================= */
    /* 3. STUDI LANJUT                                                */
    /* ============================================================= */
    {
      id: "study",
      title: "Studi Lanjut",
      icon: "graduation-cap",
      description:
        "Bagian studi lanjut ditampilkan jika Anda Melanjutkan Pendidikan.",
      fields: [
        {
          id: "f18a",
          code: "f18a",
          number: 9,
          group: "study",
          label: "Sumber biaya",
          description: "Pertanyaan studi lanjut",
          type: "radio",
          required: true,
          full: true,
          condition: { field: "f8", op: "eq", value: "4" },
          options: [
            { value: "1", label: "Biaya sendiri" },
            { value: "2", label: "Orang tua/Keluarga" },
            { value: "3", label: "Beasiswa Pemerintah" },
            { value: "4", label: "Beasiswa Perguruan Tinggi" },
            { value: "5", label: "Beasiswa Swasta/Yayasan" },
            { value: "6", label: "Perusahaan/Tempat Kerja" },
            { value: "7", label: "Sponsor" },
            { value: "8", label: "Lainnya" },
          ],
        },
        {
          id: "f18a_other",
          code: "f18a_other",
          group: "study",
          label: "Sebutkan sumber biaya lainnya",
          type: "text",
          required: false,
          full: true,
          condition: {
            field: "f18a",
            op: "eq",
            value: "8",
          },
        },
        {
          id: "f18b",
          code: "f18b",
          number: null,
          group: "study",
          label: "Perguruan Tinggi",
          description: "",
          type: "text",
          required: true,
          condition: { field: "f8", op: "eq", value: "4" },
        },
        {
          id: "f18c",
          code: "f18c",
          number: null,
          group: "study",
          label: "Program Studi",
          type: "text",
          required: true,
          condition: { field: "f8", op: "eq", value: "4" },
        },
        {
          id: "f18d",
          code: "f18d",
          number: null,
          group: "study",
          label: "Tanggal Masuk",
          description: "dd/mm/yyyy",
          type: "date",
          required: true,
          full: true,
          condition: { field: "f8", op: "eq", value: "4" },
        },
        {
          id: "f1201",
          code: "f1201",
          number: 10,
          group: "study",
          label: "Sebutkan sumberdana dalam pembiayaan kuliah?",
          description: "bukan ketika Studi Lanjut",
          type: "radio",
          required: true,
          full: true,
          condition: null,
          options: [
            { value: "1", label: "Biaya Sendiri/Keluarga" },
            { value: "2", label: "Beasiswa ADIK" },
            { value: "3", label: "Beasiswa BIDIKMISI" },
            { value: "4", label: "Beasiswa PPA" },
            { value: "5", label: "Beasiswa AFIRMASI" },
            { value: "6", label: "Beasiswa Perusahaan/Swasta" },
            { value: "7", label: "Lainnya, tuliskan" },
          ],
        },
        {
          id: "f1202",
          code: "f1202",
          number: null,
          group: "study",
          label: "Lainnya, tuliskan",
          description: "",
          type: "text",
          required: false,
          full: true,
          condition: { field: "f1201", op: "eq", value: "7" },
        },
      ],
    },

    /* ============================================================= */
    /* 4. KOMPETENSI                                                  */
    /* ============================================================= */
    {
      id: "competency",
      title: "Kompetensi",
      icon: "brain",
      description: "Kesesuaian pendidikan dan tingkat penguasaan kompetensi.",
      fields: [
        {
          id: "f14",
          code: "f14",
          number: 11,
          group: "employment",
          label: "Seberapa erat hubungan bidang studi dengan pekerjaan Anda?",
          description: "",
          type: "radio",
          required: true,
          full: true,
          condition: { field: "f8", op: "in", value: ["1", "3"] },
          options: [
            { value: "1", label: "Sangat Erat" },
            { value: "2", label: "Erat" },
            { value: "3", label: "Cukup Erat" },
            { value: "4", label: "Kurang Erat" },
            { value: "5", label: "Tidak Sama Sekali" },
          ],
        },
        {
          id: "f15",
          code: "f15",
          number: 12,
          group: "employment",
          label:
            "Tingkat pendidikan apa yang paling tepat/sesuai untuk pekerjaan anda saat ini?",
          description: "",
          type: "radio",
          required: true,
          full: true,
          condition: { field: "f8", op: "in", value: ["1", "3"] },
          options: [
            { value: "1", label: "Setingkat Lebih Tinggi" },
            { value: "2", label: "Tingkat yang Sama" },
            { value: "3", label: "Setingkat Lebih Rendah" },
            { value: "4", label: "Tidak Perlu Pendidikan Tinggi" },
          ],
        },
        {
          id: "q13",
          code: "f1761-f1774",
          number: 13,
          group: "competency",
          label:
            "Pada saat lulus, pada tingkat mana kompetensi di bawah ini anda kuasai? (A). Pada saat ini, pada tingkat mana kompetensi di bawah ini diperlukan dalam pekerjaan? (B)",
          description: "A = Kuasai saat Lulus  •  B = Diperlukan saat ini",
          type: "matrix",
          required: true,
          full: true,
          condition: null,
          scale: SCALE_1_5,
          dimensions: [
            { key: "A", label: "A - Kuasai saat Lulus" },
            { key: "B", label: "B - Diperlukan saat ini" },
          ],
          items: [
            { name: "Etika", aCode: "f1761", bCode: "f1762" },
            {
              name: "Keahlian berdasarkan bidang ilmu",
              aCode: "f1763",
              bCode: "f1764",
            },
            { name: "Bahasa Inggris", aCode: "f1765", bCode: "f1766" },
            {
              name: "Penggunaan Teknologi Informasi",
              aCode: "f1767",
              bCode: "f1768",
            },
            { name: "Komunikasi", aCode: "f1769", bCode: "f1770" },
            { name: "Kerja sama tim", aCode: "f1771", bCode: "f1772" },
            { name: "Pengembangan", aCode: "f1773", bCode: "f1774" },
          ],
        },
      ],
    },

    /* ============================================================= */
    /* 5. METODE PEMBELAJARAN                                         */
    /* ============================================================= */
    {
      id: "learning",
      title: "Metode Pembelajaran",
      icon: "book-open",
      description:
        "Menurut anda seberapa besar penekanan pada metode pembelajaran dibawah ini dilaksanakan di program studi anda?",
      fields: [
        {
          id: "f21",
          code: "f21",
          number: 14,
          group: "learningMethod",
          label: "Perkuliahan",
          description: "",
          type: "likert",
          required: true,
          full: true,
          condition: null,
          options: LIKERT_BESAR,
        },
        {
          id: "f22",
          code: "f22",
          number: null,
          group: "learningMethod",
          label: "Demonstrasi",
          description: "",
          type: "likert",
          required: true,
          full: true,
          condition: null,
          options: LIKERT_BESAR,
        },
        {
          id: "f23",
          code: "f23",
          number: null,
          group: "learningMethod",
          label: "Partisipasi dalam proyek riset",
          description: "",
          type: "likert",
          required: true,
          full: true,
          condition: null,
          options: LIKERT_BESAR,
        },
        {
          id: "f24",
          code: "f24",
          number: null,
          group: "learningMethod",
          label: "Magang",
          description: "",
          type: "likert",
          required: true,
          full: true,
          condition: null,
          options: LIKERT_BESAR,
        },
        {
          id: "f25",
          code: "f25",
          number: null,
          group: "learningMethod",
          label: "Praktikum",
          description: "",
          type: "likert",
          required: true,
          full: true,
          condition: null,
          options: LIKERT_BESAR,
        },
        {
          id: "f26",
          code: "f26",
          number: null,
          group: "learningMethod",
          label: "Kerja Lapangan",
          description: "",
          type: "likert",
          required: true,
          full: true,
          condition: null,
          options: LIKERT_BESAR,
        },
        {
          id: "f27",
          code: "f27",
          number: null,
          group: "learningMethod",
          label: "Diskusi",
          description: "",
          type: "likert",
          required: true,
          full: true,
          condition: null,
          options: LIKERT_BESAR,
        },
      ],
    },

    /* ============================================================= */
    /* 6. PENCARIAN KERJA                                             */
    /* ============================================================= */
    {
      id: "career",
      title: "Pencarian Kerja",
      icon: "search",
      description: "Proses pencarian kerja dan kesesuaian pekerjaan.",
      fields: [
        {
          id: "f301",
          code: "f301",
          number: 15,
          group: "careerSearch",
          label: "Kapan anda mulai mencari pekerjaan?",
          description: "Mohon pekerjaan sambilan tidak dimasukkan",
          type: "radio",
          required: false,
          full: true,
          condition: { field: "f8", op: "in", value: ["1", "3", "5"] },
          options: [
            { value: "1", label: "Kira-kira ... bulan sebelum lulus" },
            { value: "2", label: "Kira-kira ... bulan sesudah lulus" },
            { value: "3", label: "Saya tidak mencari kerja" },
          ],
        },
        {
          id: "f302",
          code: "f302",
          number: null,
          group: "careerSearch",
          label: "Jumlah bulan sebelum lulus",
          description: "",
          type: "number",
          required: false,
          condition: { field: "f301", op: "eq", value: "1" },
        },
        {
          id: "f303",
          code: "f303",
          number: null,
          group: "careerSearch",
          label: "Jumlah bulan sesudah lulus",
          description: "",
          type: "number",
          required: false,
          condition: { field: "f301", op: "eq", value: "2" },
        },
        {
          id: "q16",
          code: "f401-f415",
          number: 16,
          group: "careerSearch",
          label: "Bagaimana anda mencari pekerjaan tersebut?",
          description: "Jawaban bisa lebih dari satu",
          type: "checkbox",
          required: false,
          full: true,
          condition: { field: "f8", op: "in", value: ["1", "5"] },
          options: [
            { value: "f401", label: "Melalui iklan di koran/majalah, brosur" },
            {
              value: "f402",
              label: "Melamar ke perusahaan tanpa mengetahui lowongan yang ada",
            },
            { value: "f403", label: "Pergi ke bursa/pameran kerja" },
            {
              value: "f404",
              label: "Mencari lewat internet/iklan online/milis",
            },
            { value: "f405", label: "Dihubungi oleh perusahaan" },
            { value: "f406", label: "Menghubungi Kemenakertrans" },
            {
              value: "f407",
              label: "Menghubungi agen tenaga kerja komersial/swasta",
            },
            {
              value: "f408",
              label:
                "Memeroleh informasi dari pusat/kantor pengembangan karir fakultas/universitas",
            },
            {
              value: "f409",
              label: "Menghubungi kantor kemahasiswaan/hubungan alumni",
            },
            {
              value: "f410",
              label: "Membangun jejaring (network) sejak masih kuliah",
            },
            {
              value: "f411",
              label:
                "Melalui relasi (misalnya dosen, orang tua, saudara, teman, dll.)",
            },
            { value: "f412", label: "Membangun bisnis sendiri" },
            { value: "f413", label: "Melalui penempatan kerja atau magang" },
            {
              value: "f414",
              label:
                "Bekerja di tempat yang sama dengan tempat kerja semasa kuliah",
            },
            { value: "f415", label: "Lainnya" },
          ],
        },
        {
          id: "f416",
          code: "f416",
          number: null,
          group: "careerSearch",
          label: "Lainnya",
          description: "",
          type: "text",
          required: false,
          full: true,
          condition: { field: "q16", op: "includes", value: "f415" },
        },
        {
          id: "f6",
          code: "f6",
          number: 17,
          group: "careerSearch",
          label:
            "Berapa perusahaan/instansi/institusi yang sudah anda lamar (lewat surat atau e-mail) sebelum anda memeroleh pekerjaan pertama?",
          description: "perusahaan/instansi/institusi",
          type: "number",
          required: true,
          full: true,
          condition: { field: "f8", op: "in", value: ["1", "5"] },
        },
        {
          id: "f7",
          code: "f7",
          number: 18,
          group: "careerSearch",
          label:
            "Berapa banyak perusahaan/instansi/institusi yang merespons lamaran anda?",
          description: "perusahaan/instansi/institusi",
          type: "number",
          required: true,
          full: true,
          condition: { field: "f8", op: "in", value: ["1", "5"] },
        },
        {
          id: "f7a",
          code: "f7a",
          number: 19,
          group: "careerSearch",
          label:
            "Berapa banyak perusahaan/instansi/institusi yang mengundang anda untuk wawancara?",
          description: "perusahaan/instansi/institusi",
          type: "number",
          required: true,
          full: true,
          condition: { field: "f8", op: "in", value: ["1", "5"] },
        },
        {
          id: "f1001",
          code: "f1001",
          number: 20,
          group: "careerSearch",
          label: "Apakah anda aktif mencari pekerjaan dalam 4 minggu terakhir?",
          description: "Pilihlah satu jawaban",
          type: "radio",
          required: false,
          full: true,
          condition: { field: "f8", op: "in", value: ["1", "5"] },
          options: [
            { value: "1", label: "Tidak" },
            {
              value: "2",
              label: "Tidak, tapi saya sedang menunggu hasil lamaran kerja",
            },
            {
              value: "3",
              label: "Ya, saya akan mulai bekerja dalam 2 minggu ke depan",
            },
            {
              value: "4",
              label:
                "Ya, tapi saya belum pasti akan bekerja dalam 2 minggu ke depan",
            },
            { value: "5", label: "Lainnya" },
          ],
        },
        {
          id: "f1002",
          code: "f1002",
          number: null,
          group: "careerSearch",
          label: "Lainnya",
          description: "",
          type: "text",
          required: false,
          full: true,
          condition: { field: "f1001", op: "eq", value: "5" },
        },
        {
          id: "q21",
          code: "f1601-f1613",
          number: 21,
          group: "jobSuitability",
          label:
            "Jika menurut anda pekerjaan anda saat ini tidak sesuai dengan pendidikan anda, mengapa anda mengambilnya?",
          description: "Jawaban bisa lebih dari satu",
          type: "checkbox",
          required: true,
          full: true,
          condition: { field: "f8", op: "in", value: ["1", "3"] },
          options: [
            {
              value: "f1601",
              label:
                "Pertanyaan tidak sesuai; pekerjaan saya sekarang sudah sesuai dengan pendidikan saya.",
            },
            {
              value: "f1602",
              label: "Saya belum mendapatkan pekerjaan yang lebih sesuai.",
            },
            {
              value: "f1603",
              label: "Di pekerjaan ini saya memeroleh prospek karir yang baik.",
            },
            {
              value: "f1604",
              label:
                "Saya lebih suka bekerja di area pekerjaan yang tidak ada hubungannya dengan pendidikan saya.",
            },
            {
              value: "f1605",
              label:
                "Saya dipromosikan ke posisi yang kurang berhubungan dengan pendidikan saya dibanding posisi sebelumnya.",
            },
            {
              value: "f1606",
              label:
                "Saya dapat memeroleh pendapatan yang lebih tinggi di pekerjaan ini.",
            },
            {
              value: "f1607",
              label: "Pekerjaan saya saat ini lebih aman/terjamin/secure",
            },
            { value: "f1608", label: "Pekerjaan saya saat ini lebih menarik" },
            {
              value: "f1609",
              label:
                "Pekerjaan saya saat ini lebih memungkinkan saya mengambil pekerjaan tambahan/ jadwal yang fleksibel, dll.",
            },
            {
              value: "f1610",
              label:
                "Pekerjaan saya saat ini lokasinya lebih dekat dari rumah saya.",
            },
            {
              value: "f1611",
              label:
                "Pekerjaan saya saat ini dapat lebih menjamin kebutuhan keluarga saya.",
            },
            {
              value: "f1612",
              label:
                "Pada awal meniti karir ini, saya harus menerima pekerjaan yang tidak berhubungan dengan pendidikan saya",
            },
            { value: "f1613", label: "Lainnya" },
          ],
        },
        {
          id: "f1614",
          code: "f1614",
          number: null,
          group: "jobSuitability",
          label: "Lainnya",
          description: "",
          type: "text",
          required: false,
          full: true,
          condition: { field: "q21", op: "includes", value: "f1613" },
        },
      ],
    },

    /* ============================================================= */
    /* 7. REVIEW                                                      */
    /* ============================================================= */
    {
      id: "review",
      title: "Review",
      icon: "clipboard-list",
      description: "Periksa kembali jawaban Anda sebelum mengirim.",
      fields: [],
    },
  ],
};

/* Flat list helper */
window.FORM_SCHEMA.allFields = window.FORM_SCHEMA.sections.flatMap((s) =>
  s.fields.map((f) => ({ ...f, section: s.id })),
);
