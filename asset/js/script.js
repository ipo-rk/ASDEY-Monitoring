document.addEventListener('alpine:init', () => {
    Alpine.data('app', () => ({

        // ══════════════════════════════════════════════
        // STATE DASAR & UI
        // ══════════════════════════════════════════════
        sidebarOpen: window.innerWidth >= 1024,
        darkMode: localStorage.theme === 'dark' ||
            (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches),
        currentPage: 'dashboard',
        notificationsOpen: false,
        profileOpen: false,
        profileModalOpen: false,
        activeTab: 'profile',
        saving: false,
        exporting: false,
        exportFormat: '',
        assigning: false,

        // ══════════════════════════════════════════════
        // KONSTANTA – ubah angka ini untuk ganti batas maksimal penghuni per kamar
        // ══════════════════════════════════════════════
        MAX_PENGHUNI_PER_KAMAR: 3,

        // ══════════════════════════════════════════════
        // ROLE & AKSES (RBAC) — diisi dari data login (login.html)
        // ══════════════════════════════════════════════
        currentRole: localStorage.getItem('loggedInRole') || 'penghuni',
        currentUsername: localStorage.getItem('loggedInUsername') || localStorage.getItem('loggedInUser') || '',
        currentUserId: localStorage.getItem('loggedInUserId') || '',
        currentNik: localStorage.getItem('loggedInNik') || '',

        ROLE_LABEL: {
            admin: 'Administrator',
            pembina: 'Pembina Asrama',
            penghuni: 'Penghuni',
            pimpinan: 'Pimpinan'
        },

        PAGE_TITLES: {
            dashboard: 'Dashboard',
            kartu: 'Kartu Anggota',
            penghuni: 'Data Penghuni',
            kamar: 'Manajemen Kamar',
            presensi: 'Presensi & Kehadiran',
            izin: 'Izin Keluar/Masuk',
            pelanggaran: 'Pelanggaran',
            aktivitas: 'Aktivitas Asrama',
            inventaris: 'Inventaris',
            laporan: 'Laporan',
            pengguna: 'Manajemen Pengguna'
        },

        ROLE_ACCESS: {
            admin: ['dashboard', 'penghuni', 'kamar', 'presensi', 'izin', 'pelanggaran', 'aktivitas', 'inventaris', 'laporan', 'pengguna'],
            pembina: ['dashboard', 'penghuni', 'kamar', 'presensi', 'izin', 'pelanggaran', 'aktivitas', 'inventaris', 'laporan'],
            pimpinan: ['dashboard', 'penghuni', 'kamar', 'presensi', 'izin', 'pelanggaran', 'aktivitas', 'inventaris', 'laporan'],
            penghuni: ['dashboard', 'kartu', 'presensi', 'izin', 'pelanggaran', 'aktivitas']
        },

        // ══════════════════════════════════════════════
        // DATA BARU — PRESENSI, IZIN, PELANGGARAN, AKTIVITAS, PENGGUNA, NOTIFIKASI
        // ══════════════════════════════════════════════
        presensi: [],
        izin: [],
        pelanggaran: [],
        aktivitas: [],
        users: [],
        notifikasi: [],

        // Filter & state — PRESENSI
        presensiManualNik: '',
        filterTanggalPresensi: '',
        filterStatusPresensi: '',
        dashboardScannerActive: false,
        scannerOpen: false,
        scanFeedback: null,

        // Modal — Kartu Anggota (QR)
        kartuModalOpen: false,
        kartuPenghuni: null,

        // Modal & filter — IZIN
        izinModalOpen: false,
        izinForm: {},
        izinDetailOpen: false,
        selectedIzin: null,
        filterStatusIzin: '',

        // Modal & filter — PELANGGARAN
        pelanggaranModalOpen: false,
        isEditPelanggaran: false,
        pelanggaranForm: {},
        filterStatusPelanggaran: '',

        // Modal & filter — AKTIVITAS
        aktivitasModalOpen: false,
        isEditAktivitas: false,
        aktivitasForm: {},
        filterJenisAktivitas: '',

        // Modal — MANAJEMEN PENGGUNA
        userModalOpen: false,
        isEditUser: false,
        userForm: {},

        // Instance scanner QR aktif (internal)
        _qrScannerInstance: null,

        // ══════════════════════════════════════════════
        // DATA UTAMA
        // ══════════════════════════════════════════════
        penghuni: [],
        barak: [],
        inventaris: [],

        userProfile: {
            name: 'Richy Rizaldo',
            email: 'richy.rizaldo@example.com',
            phone: '0812-3456-7890',
            photo: ''
        },

        settings: {
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
            emailNotifications: true
        },

        // ══════════════════════════════════════════════
        // MODALS – PENGHUNI
        // ══════════════════════════════════════════════
        modalOpen: false,
        isEditMode: false,
        form: {},

        riwayatOpen: false,
        selectedPenghuni: null,
        selectedRiwayat: [],

        // ══════════════════════════════════════════════
        // MODALS – KAMAR / BARAK
        // ══════════════════════════════════════════════
        assignModalOpen: false,
        selectedKamar: null,
        selectedPenghuniId: '',
        assignSelectedBarakId: '',
        assignSelectedKamarNomor: '',

        detailKamarOpen: false,
        selectedDetailBarak: null,

        riwayatKamarOpen: false,
        selectedKamarRiwayat: null,
        selectedRiwayatKamar: [],

        barakModalOpen: false,
        isEditBarak: false,
        barakForm: { lantai: '', sisi: '', kapasitas: '' },

        // ══════════════════════════════════════════════
        // MODALS – INVENTARIS
        // ══════════════════════════════════════════════
        inventarisModalOpen: false,
        isEditInventaris: false,
        inventarisForm: {},
        daftarKamarPilihan: [],

        // ══════════════════════════════════════════════
        // FILTERS & PAGINATION
        // ══════════════════════════════════════════════
        searchQuery: '',
        filterJenjang: '',
        filterTahun: '',
        filterStatus: '',
        currentPageTable: 1,
        itemsPerPage: 10,

        filterStatusKamar: '',
        currentPageKamar: 1,
        itemsPerPageKamar: 6,

        filterBarakInventaris: '',
        filterJenisInventaris: '',

        filterPeriode: 'bulan',
        filterTahunLaporan: String(new Date().getFullYear()),

        // ══════════════════════════════════════════════
        // STORAGE KEYS
        // ══════════════════════════════════════════════
        STORAGE_KEYS: {
            PENGHUNI: 'simasra_penghuni',
            BARAK: 'simasra_barak',
            INVENTARIS: 'simasra_inventaris',
            USER_PROFILE: 'simasra_user_profile',
            USER_SETTINGS: 'simasra_user_settings',
            PRESENSI: 'simasra_presensi',
            IZIN: 'simasra_izin',
            PELANGGARAN: 'simasra_pelanggaran',
            AKTIVITAS: 'simasra_aktivitas',
            USERS: 'simasra_users',
            NOTIFIKASI: 'simasra_notifikasi'
        },

        // ══════════════════════════════════════════════
        // HELPER KAMAR – multi-penghuni per kamar
        // Struktur kamar baru: penghuniList (array NIK, maks MAX_PENGHUNI_PER_KAMAR)
        // Status kamar: 'kosong' | 'terisi_sebagian' | 'penuh'
        // ══════════════════════════════════════════════

        _jumlahPenghuniKamar(kamar) {
            return (kamar.penghuniList || []).length;
        },

        _kamarBisaDisisi(kamar) {
            return this._jumlahPenghuniKamar(kamar) < this.MAX_PENGHUNI_PER_KAMAR;
        },

        _updateStatusKamar(kamar) {
            const jml = this._jumlahPenghuniKamar(kamar);
            if (jml === 0) kamar.status = 'kosong';
            else if (jml >= this.MAX_PENGHUNI_PER_KAMAR) kamar.status = 'penuh';
            else kamar.status = 'terisi_sebagian';
            return kamar;
        },

        _updateStatusBarak(barak) {
            const kamarList = barak.daftarKamar || [];
            barak.terisi = kamarList.reduce((s, k) => s + this._jumlahPenghuniKamar(k), 0);
            const adaIsi = kamarList.some(k => k.status !== 'kosong');
            const semuaPenuh = kamarList.length > 0 && kamarList.every(k => k.status === 'penuh');
            if (!adaIsi) barak.status = 'kosong';
            else if (semuaPenuh) barak.status = 'penuh';
            else barak.status = 'terisi_sebagian';
            return barak;
        },

        _namaPenghuniKamar(kamar) {
            return (kamar.penghuniList || []).map(nik => {
                const p = this.penghuni.find(x => x.nik === nik);
                return { nik, nama: p?.nama || '(data hilang)' };
            });
        },

        // ══════════════════════════════════════════════
        // GETTERS – BARAK & KAMAR
        // ══════════════════════════════════════════════
        get totalKamarComputed() {
            return this.barak.reduce((s, b) => s + (b.daftarKamar?.length || 0), 0);
        },
        get totalBarak() { return this.barak.length; },
        get barakTerisi() {
            return this.barak.filter(b => b.status !== 'kosong' && b.status !== 'maintenance').length;
        },
        get barakKosong() {
            return this.barak.filter(b => b.status === 'kosong').length;
        },
        get kamarKosong() {
            return this.barak.reduce((s, b) =>
                s + (b.daftarKamar || []).filter(k => k.status === 'kosong').length, 0);
        },
        get slotTersedia() {
            return this.barak.reduce((s, b) =>
                s + (b.daftarKamar || []).reduce((ss, k) =>
                    ss + Math.max(0, this.MAX_PENGHUNI_PER_KAMAR - this._jumlahPenghuniKamar(k)), 0), 0);
        },
        get filteredBarak() {
            let r = [...this.barak];
            if (this.filterStatusKamar) r = r.filter(b => b.status === this.filterStatusKamar);
            const s = (this.currentPageKamar - 1) * this.itemsPerPageKamar;
            return r.slice(s, s + this.itemsPerPageKamar);
        },
        get filteredBarakAll() {
            if (!this.filterStatusKamar) return this.barak;
            return this.barak.filter(b => b.status === this.filterStatusKamar);
        },
        get barakBisaDiassign() {
            return this.barak.filter(b =>
                b.status !== 'maintenance' && b.status !== 'penuh' &&
                (b.daftarKamar || []).some(k => this._kamarBisaDisisi(k))
            );
        },
        get assignBarakDetail() {
            if (!this.assignSelectedBarakId) return null;
            return this.barak.find(b => String(b.id) === String(this.assignSelectedBarakId)) || null;
        },

        // ══════════════════════════════════════════════
        // GETTERS – PENGHUNI
        // ══════════════════════════════════════════════
        get penghuniAktif() {
            return this.penghuni.filter(p => p.status === 'aktif').length;
        },
        get penghuniBisaDiassign() {
            return this.penghuni
                .filter(p => p.status === 'aktif' && !p.kamarSaatIni)
                .sort((a, b) => a.nama.localeCompare(b.nama));
        },
        get selectedPenghuniDetail() {
            if (!this.selectedPenghuniId) return null;
            return this.penghuni.find(p => p.nik === this.selectedPenghuniId) || null;
        },
        get availableYears() {
            const ys = [...new Set(this.penghuni.map(p => Number(p.tahun_masuk)).filter(y => !isNaN(y)))];
            return ys.length ? ys.sort((a, b) => b - a) : [new Date().getFullYear()];
        },
        get filteredPenghuni() {
            const all = this.filteredPenghuniAll;
            const s = (this.currentPageTable - 1) * this.itemsPerPage;
            return all.slice(s, s + this.itemsPerPage);
        },
        get filteredPenghuniAll() {
            let r = [...this.penghuni];
            const q = (this.searchQuery || '').toLowerCase().trim();
            if (q) r = r.filter(p =>
                (p.nik || '').toLowerCase().includes(q) ||
                (p.nama || '').toLowerCase().includes(q) ||
                (p.nisn_nim || '').toLowerCase().includes(q) ||
                (p.distrik || '').toLowerCase().includes(q)
            );
            if (this.filterJenjang) r = r.filter(p => p.jenjang === this.filterJenjang);
            if (this.filterTahun) r = r.filter(p => Number(p.tahun_masuk) === Number(this.filterTahun));
            if (this.filterStatus) r = r.filter(p => p.status === this.filterStatus);
            return r;
        },

        // ══════════════════════════════════════════════
        // GETTERS – LAPORAN
        // ══════════════════════════════════════════════
        get hunianPersen() {
            const totalSlot = this.barak.reduce((s, b) =>
                s + (b.daftarKamar || []).length * this.MAX_PENGHUNI_PER_KAMAR, 0);
            const terisi = this.penghuni.filter(p => p.status === 'aktif' && p.kamarSaatIni).length;
            return totalSlot > 0 ? Math.round((terisi / totalSlot) * 100) : 0;
        },
        get alumniTahunIni() {
            const th = new Date().getFullYear();
            return this.penghuni.filter(p => {
                if (p.status !== 'alumni') return false;
                if (p.tanggalKeluar) return new Date(p.tanggalKeluar).getFullYear() === th;
                return Number(p.tahun_masuk) + 3 === th;
            }).length;
        },
        get laporanDistrik() {
            const g = {};
            this.penghuni.forEach(p => {
                if (p.status === 'aktif') { const d = p.distrik || 'Lainnya'; g[d] = (g[d] || 0) + 1; }
            });
            return Object.entries(g).map(([distrik, jumlah]) => ({ distrik, jumlah })).sort((a, b) => b.jumlah - a.jumlah);
        },
        get laporanJenjang() {
            const g = {};
            this.penghuni.forEach(p => {
                if (p.status === 'aktif') { const j = p.jenjang || 'Lainnya'; g[j] = (g[j] || 0) + 1; }
            });
            return Object.entries(g).map(([jenjang, jumlah]) => ({ jenjang, jumlah })).sort((a, b) => b.jumlah - a.jumlah);
        },
        get laporanStatus() {
            return [
                { label: 'Aktif', jumlah: this.penghuni.filter(p => p.status === 'aktif').length, warna: '#22c55e' },
                { label: 'Keluar', jumlah: this.penghuni.filter(p => p.status === 'keluar').length, warna: '#f97316' },
                { label: 'Alumni', jumlah: this.penghuni.filter(p => p.status === 'alumni').length, warna: '#8b5cf6' }
            ];
        },
        get laporanHunianBarak() {
            const terisi = this.penghuni.filter(p => p.status === 'aktif' && p.kamarSaatIni).length;
            const totalSlot = this.barak.reduce((s, b) =>
                s + (b.daftarKamar || []).length * this.MAX_PENGHUNI_PER_KAMAR, 0);
            return [
                { label: 'Terisi', jumlah: terisi, warna: '#3b82f6' },
                { label: 'Kosong', jumlah: Math.max(0, totalSlot - terisi), warna: '#e2e8f0' }
            ];
        },
        get availableYearsLaporan() {
            const cur = new Date().getFullYear();
            return Array.from({ length: 10 }, (_, i) => String(cur - i));
        },

        // ══════════════════════════════════════════════
        // GETTERS – INVENTARIS
        // ══════════════════════════════════════════════
        get filteredInventaris() {
            let r = [...this.inventaris];
            if (this.filterBarakInventaris) r = r.filter(i => String(i.barakId) === String(this.filterBarakInventaris));
            if (this.filterJenisInventaris) r = r.filter(i => i.jenis === this.filterJenisInventaris);
            return r;
        },
        get totalBaik() { return this.inventaris.reduce((s, i) => s + (Number(i.baik) || 0), 0); },
        get totalRusakRingan() { return this.inventaris.reduce((s, i) => s + (Number(i.rusakRingan) || 0), 0); },
        get totalRusakBerat() { return this.inventaris.reduce((s, i) => s + (Number(i.rusakBerat) || 0), 0); },
        get totalInventaris() { return this.totalBaik + this.totalRusakRingan + this.totalRusakBerat; },
        get persenBaik() { return this.totalInventaris ? Math.round((this.totalBaik / this.totalInventaris) * 100) : 0; },
        get persenRusakRingan() { return this.totalInventaris ? Math.round((this.totalRusakRingan / this.totalInventaris) * 100) : 0; },
        get persenRusakBerat() { return this.totalInventaris ? Math.round((this.totalRusakBerat / this.totalInventaris) * 100) : 0; },

        // ══════════════════════════════════════════════
        // GETTERS & HELPER — ROLE / AKSES
        // ══════════════════════════════════════════════
        hasAccess(page) {
            return (this.ROLE_ACCESS[this.currentRole] || []).includes(page);
        },
        isAdmin() { return this.currentRole === 'admin'; },
        isAdminOrPembina() { return this.currentRole === 'admin' || this.currentRole === 'pembina'; },

        get myPenghuni() {
            if (!this.currentNik) return null;
            return this.penghuni.find(p => p.nik === this.currentNik) || null;
        },

        get penghuniAktifList() {
            return this.penghuni
                .filter(p => p.status === 'aktif')
                .slice()
                .sort((a, b) => (a.nama || '').localeCompare(b.nama || ''));
        },

        namaPenghuniByNik(nik) {
            const p = this.penghuni.find(x => x.nik === nik);
            return p ? p.nama : (nik || '—');
        },

        waktuRelatif(iso) {
            if (!iso) return '';
            const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
            if (diff < 60) return 'Baru saja';
            if (diff < 3600) return Math.floor(diff / 60) + ' menit lalu';
            if (diff < 86400) return Math.floor(diff / 3600) + ' jam lalu';
            if (diff < 2592000) return Math.floor(diff / 86400) + ' hari lalu';
            return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
        },

        // ══════════════════════════════════════════════
        // GETTERS — PRESENSI
        // ══════════════════════════════════════════════
        get presensiHariIni() {
            const today = new Date().toISOString().slice(0, 10);
            return this.presensi.filter(r => r.tanggal === today);
        },
        get hadirHariIni() { return this.presensiHariIni.length; },
        get izinHariIniCount() {
            return this.izin.filter(i => i.status === 'disetujui').length;
        },
        get tidakHadirHariIni() {
            const hadirNiks = new Set(this.presensiHariIni.map(r => r.nik));
            const izinNiks = new Set(this.izin.filter(i => i.status === 'disetujui').map(i => i.nik));
            return this.penghuniAktifList.filter(p => !hadirNiks.has(p.nik) && !izinNiks.has(p.nik)).length;
        },
        get persenKehadiranHariIni() {
            const total = this.penghuniAktifList.length;
            return total ? Math.round((this.hadirHariIni / total) * 100) : 0;
        },
        get filteredPresensi() {
            let r = [...this.presensi];
            if (this.currentRole === 'penghuni') r = r.filter(x => x.nik === this.currentNik);
            if (this.filterTanggalPresensi) r = r.filter(x => x.tanggal === this.filterTanggalPresensi);
            if (this.filterStatusPresensi) r = r.filter(x => x.statusMasuk === this.filterStatusPresensi);
            return r.sort((a, b) => (b.tanggal + (b.jamMasuk || '')).localeCompare(a.tanggal + (a.jamMasuk || '')));
        },
        persentaseKehadiranPenghuni(nik) {
            const days = 30;
            const now = new Date();
            let hadir = 0;
            for (let i = 0; i < days; i++) {
                const d = new Date(now);
                d.setDate(d.getDate() - i);
                const key = d.toISOString().slice(0, 10);
                if (this.presensi.some(r => r.nik === nik && r.tanggal === key)) hadir++;
            }
            return Math.round((hadir / days) * 100);
        },

        // ══════════════════════════════════════════════
        // GETTERS — IZIN
        // ══════════════════════════════════════════════
        get izinMenungguCount() { return this.izin.filter(i => i.status === 'menunggu').length; },
        get izinTelatKembali() {
            const now = new Date();
            return this.izin.filter(i => i.status === 'disetujui' && i.estimasiKembali && new Date(i.estimasiKembali) < now);
        },
        get filteredIzin() {
            let r = [...this.izin];
            if (this.currentRole === 'penghuni') r = r.filter(i => i.nik === this.currentNik);
            if (this.filterStatusIzin) r = r.filter(i => i.status === this.filterStatusIzin);
            return r.sort((a, b) => new Date(b.diajukanPada || 0) - new Date(a.diajukanPada || 0));
        },

        // ══════════════════════════════════════════════
        // GETTERS — PELANGGARAN
        // ══════════════════════════════════════════════
        get pelanggaranAktifCount() { return this.pelanggaran.filter(p => p.status === 'proses').length; },
        get filteredPelanggaran() {
            let r = [...this.pelanggaran];
            if (this.currentRole === 'penghuni') r = r.filter(p => p.nik === this.currentNik);
            if (this.filterStatusPelanggaran) r = r.filter(p => p.status === this.filterStatusPelanggaran);
            return r.sort((a, b) => new Date(b.tanggal || 0) - new Date(a.tanggal || 0));
        },

        // ══════════════════════════════════════════════
        // GETTERS — AKTIVITAS
        // ══════════════════════════════════════════════
        get filteredAktivitas() {
            let r = [...this.aktivitas];
            if (this.filterJenisAktivitas) r = r.filter(a => a.jenis === this.filterJenisAktivitas);
            return r.sort((a, b) => new Date(b.tanggal || 0) - new Date(a.tanggal || 0));
        },

        // ══════════════════════════════════════════════
        // GETTERS — PENGGUNA
        // ══════════════════════════════════════════════
        get filteredUsers() { return this.users; },

        // ══════════════════════════════════════════════
        // GETTERS — NOTIFIKASI
        // ══════════════════════════════════════════════
        get notifikasiUntukSaya() {
            return this.notifikasi
                .filter(n => {
                    if (n.untukNik && n.untukNik === this.currentNik) return true;
                    if (n.untukRole && n.untukRole.includes(this.currentRole)) return true;
                    if (!n.untukNik && !n.untukRole) return true;
                    return false;
                })
                .sort((a, b) => new Date(b.waktu) - new Date(a.waktu));
        },
        get unreadNotifCount() {
            return this.notifikasiUntukSaya.filter(n => !n.dibaca).length;
        },

        // ══════════════════════════════════════════════
        // STORAGE
        // ══════════════════════════════════════════════
        loadFromStorage() {
            const loadArr = key => {
                try {
                    const s = localStorage.getItem(key);
                    if (!s) return null;
                    const p = JSON.parse(s);
                    return Array.isArray(p) ? p : null;
                } catch { return null; }
            };
            this.penghuni = loadArr(this.STORAGE_KEYS.PENGHUNI) || [];
            this.barak = loadArr(this.STORAGE_KEYS.BARAK) || [];
            this.inventaris = loadArr(this.STORAGE_KEYS.INVENTARIS) || [];

            // Sanitasi & migrasi data lama ke format multi-penghuni
            this.barak = this.barak.map((b, idx) => {
                if (b.id == null) b.id = Date.now() + idx;
                if (!Array.isArray(b.daftarKamar)) b.daftarKamar = [];
                b.daftarKamar = b.daftarKamar.map(k => {
                    k.riwayat = Array.isArray(k.riwayat) ? k.riwayat : [];
                    // MIGRASI: format lama pakai penghuniNIK (string)
                    if (!Array.isArray(k.penghuniList)) {
                        k.penghuniList = (k.penghuniNIK && k.penghuniNIK !== null)
                            ? [k.penghuniNIK] : [];
                    }
                    delete k.penghuniNIK;
                    this._updateStatusKamar(k);
                    return k;
                });
                this._updateStatusBarak(b);
                return b;
            });

            if (!this.penghuni.length && !this.barak.length) {
                this.resetInitialData();
                return;
            }
            this.saveToStorage();
        },

        loadUserData() {
            try {
                const p = localStorage.getItem(this.STORAGE_KEYS.USER_PROFILE);
                if (p) this.userProfile = { ...this.userProfile, ...JSON.parse(p) };
                const s = localStorage.getItem(this.STORAGE_KEYS.USER_SETTINGS);
                if (s) this.settings = { ...this.settings, ...JSON.parse(s) };
            } catch (e) { console.warn('loadUserData:', e); }
        },

        saveToStorage() {
            try {
                localStorage.setItem(this.STORAGE_KEYS.PENGHUNI, JSON.stringify(this.penghuni));
                localStorage.setItem(this.STORAGE_KEYS.BARAK, JSON.stringify(this.barak));
                localStorage.setItem(this.STORAGE_KEYS.INVENTARIS, JSON.stringify(this.inventaris));
            } catch (e) {
                Swal.fire('Peringatan', 'Gagal menyimpan data. Penyimpanan penuh?', 'warning');
            }
        },

        saveUserData() {
            try {
                localStorage.setItem(this.STORAGE_KEYS.USER_PROFILE, JSON.stringify(this.userProfile));
                localStorage.setItem(this.STORAGE_KEYS.USER_SETTINGS, JSON.stringify(this.settings));
            } catch (e) { console.warn('saveUserData:', e); }
        },

        // Akun demo bawaan — harus identik dengan defaultUsers di login.html
        _seedDefaultUsers() {
            return [
                { id: 1, username: 'admin', password: 'admin123', role: 'admin', nama: 'Admin SIMASRA', nik: null, active: true },
                { id: 2, username: 'pembina', password: 'pembina123', role: 'pembina', nama: 'Yulianus Kegou, S.Pd', nik: null, active: true },
                { id: 3, username: 'pimpinan', password: 'pimpinan123', role: 'pimpinan', nama: 'Kepala Bidang Kesra', nik: null, active: true },
                { id: 4, username: 'penghuni', password: 'penghuni123', role: 'penghuni', nama: 'Yohanis Duwiri', nik: '9102017501010001', active: true },
            ];
        },

        loadExtraData() {
            const loadArr = key => {
                try {
                    const s = localStorage.getItem(key);
                    if (!s) return null;
                    const p = JSON.parse(s);
                    return Array.isArray(p) ? p : null;
                } catch { return null; }
            };
            this.presensi = loadArr(this.STORAGE_KEYS.PRESENSI) || [];
            this.izin = loadArr(this.STORAGE_KEYS.IZIN) || [];
            this.pelanggaran = loadArr(this.STORAGE_KEYS.PELANGGARAN) || [];
            this.aktivitas = loadArr(this.STORAGE_KEYS.AKTIVITAS) || [];
            this.notifikasi = loadArr(this.STORAGE_KEYS.NOTIFIKASI) || [];
            const u = loadArr(this.STORAGE_KEYS.USERS);
            this.users = (u && u.length) ? u : this._seedDefaultUsers();
            this.saveExtraData();
        },

        saveExtraData() {
            try {
                localStorage.setItem(this.STORAGE_KEYS.PRESENSI, JSON.stringify(this.presensi));
                localStorage.setItem(this.STORAGE_KEYS.IZIN, JSON.stringify(this.izin));
                localStorage.setItem(this.STORAGE_KEYS.PELANGGARAN, JSON.stringify(this.pelanggaran));
                localStorage.setItem(this.STORAGE_KEYS.AKTIVITAS, JSON.stringify(this.aktivitas));
                localStorage.setItem(this.STORAGE_KEYS.NOTIFIKASI, JSON.stringify(this.notifikasi));
                localStorage.setItem(this.STORAGE_KEYS.USERS, JSON.stringify(this.users));
            } catch (e) { console.warn('saveExtraData:', e); }
        },

        // ══════════════════════════════════════════════
        // NOTIFIKASI
        // ══════════════════════════════════════════════
        _tambahNotifikasi({ tipe, judul, pesan, untukRole = null, untukNik = null }) {
            this.notifikasi.unshift({
                id: Date.now() + Math.random(),
                tipe, judul, pesan,
                waktu: new Date().toISOString(),
                dibaca: false,
                untukRole, untukNik
            });
            if (this.notifikasi.length > 100) this.notifikasi = this.notifikasi.slice(0, 100);
            this.saveExtraData();
        },

        tandaiSemuaDibaca() {
            this.notifikasiUntukSaya.forEach(n => { n.dibaca = true; });
            this.saveExtraData();
        },

        bukaNotifikasi(n) {
            n.dibaca = true;
            this.saveExtraData();
            this.notificationsOpen = false;
            if (n.tipe === 'izin') this.setPage('izin');
            else if (n.tipe === 'pelanggaran') this.setPage('pelanggaran');
            else if (n.tipe === 'presensi' || n.tipe === 'telat') this.setPage('presensi');
            else if (n.tipe === 'pengumuman') this.setPage('dashboard');
        },

        buatPengumuman() {
            Swal.fire({
                title: 'Buat Pengumuman',
                input: 'text',
                inputPlaceholder: 'Tulis isi pengumuman untuk seluruh penghuni...',
                showCancelButton: true,
                confirmButtonText: 'Kirim',
                confirmButtonColor: '#3b82f6'
            }).then(r => {
                if (r.isConfirmed && r.value && r.value.trim()) {
                    this._tambahNotifikasi({
                        tipe: 'pengumuman',
                        judul: 'Pengumuman',
                        pesan: r.value.trim(),
                        untukRole: ['admin', 'pembina', 'penghuni', 'pimpinan']
                    });
                    Swal.fire({ icon: 'success', title: 'Pengumuman terkirim', timer: 1200, showConfirmButton: false });
                }
            });
        },

        // ══════════════════════════════════════════════
        // PRESENSI — QR SCAN & MANUAL
        // ══════════════════════════════════════════════
        _catatPresensi(nik, metode) {
            if (!nik) return { ok: false, msg: 'Kode tidak valid.' };
            const p = this.penghuni.find(x => x.nik === nik && x.status === 'aktif');
            if (!p) return { ok: false, msg: 'Penghuni tidak ditemukan atau tidak aktif.' };

            const today = new Date().toISOString().slice(0, 10);
            const now = new Date();
            const jam = now.toTimeString().slice(0, 5);
            const batasJamMasuk = '22:00';

            let rec = this.presensi.find(r => r.nik === nik && r.tanggal === today);
            if (!rec) {
                rec = {
                    id: Date.now(),
                    nik,
                    tanggal: today,
                    jamMasuk: jam,
                    jamKeluar: '',
                    statusMasuk: jam > batasJamMasuk ? 'terlambat' : 'tepat_waktu',
                    metode
                };
                this.presensi.unshift(rec);
                this.saveExtraData();
                this._tambahNotifikasi({
                    tipe: rec.statusMasuk === 'terlambat' ? 'telat' : 'presensi',
                    judul: rec.statusMasuk === 'terlambat' ? 'Presensi Terlambat' : 'Presensi Masuk',
                    pesan: `${p.nama} check-in pukul ${jam}`,
                    untukRole: ['admin', 'pembina']
                });
                return { ok: true, msg: `${p.nama} berhasil check-in pukul ${jam}.`, type: 'checkin' };
            } else if (!rec.jamKeluar) {
                rec.jamKeluar = jam;
                this.saveExtraData();
                this._tambahNotifikasi({
                    tipe: 'presensi',
                    judul: 'Presensi Keluar',
                    pesan: `${p.nama} check-out pukul ${jam}`,
                    untukRole: ['admin', 'pembina']
                });
                return { ok: true, msg: `${p.nama} berhasil check-out pukul ${jam}.`, type: 'checkout' };
            }
            return { ok: false, msg: `${p.nama} sudah presensi masuk & keluar hari ini.` };
        },

        catatPresensiManual() {
            if (!this.presensiManualNik) return;
            const r = this._catatPresensi(this.presensiManualNik, 'manual');
            Swal.fire({ icon: r.ok ? 'success' : 'warning', title: r.ok ? 'Berhasil' : 'Gagal', text: r.msg, timer: 1800, showConfirmButton: false });
            if (r.ok) this.presensiManualNik = '';
        },

        _startQrScanner(elementId, onSuccess) {
            if (typeof Html5Qrcode === 'undefined') {
                this.scanFeedback = { type: 'error', text: 'Pustaka pemindai QR gagal dimuat.' };
                return;
            }
            this._stopQrScanner();
            const scanner = new Html5Qrcode(elementId);
            this._qrScannerInstance = scanner;
            scanner.start(
                { facingMode: 'environment' },
                { fps: 10, qrbox: 220 },
                (decodedText) => onSuccess(decodedText),
                () => { /* abaikan error per-frame */ }
            ).catch(() => {
                this.scanFeedback = { type: 'error', text: 'Tidak dapat mengakses kamera. Periksa izin kamera browser Anda.' };
            });
        },

        _stopQrScanner() {
            if (this._qrScannerInstance) {
                try {
                    this._qrScannerInstance.stop().then(() => {
                        try { this._qrScannerInstance.clear(); } catch (e) { /* abaikan */ }
                    }).catch(() => { /* abaikan */ });
                } catch (e) { /* abaikan */ }
                this._qrScannerInstance = null;
            }
        },

        openScanner() {
            this.scannerOpen = true;
            this.scanFeedback = null;
            this.$nextTick(() => {
                this._startQrScanner('qr-reader', (nik) => {
                    const r = this._catatPresensi(nik, 'qr');
                    this.scanFeedback = { type: r.ok ? 'success' : 'error', text: r.msg };
                });
            });
        },

        closeScanner() {
            this.scannerOpen = false;
            this._stopQrScanner();
            this.scanFeedback = null;
        },

        toggleDashboardScanner() {
            this.dashboardScannerActive = !this.dashboardScannerActive;
            this.scanFeedback = null;
            if (this.dashboardScannerActive) {
                this.$nextTick(() => {
                    this._startQrScanner('qr-reader-dashboard', (nik) => {
                        const r = this._catatPresensi(nik, 'qr');
                        this.scanFeedback = { type: r.ok ? 'success' : 'error', text: r.msg };
                    });
                });
            } else {
                this._stopQrScanner();
            }
        },

        // ══════════════════════════════════════════════
        // KARTU ANGGOTA (QR)
        // ══════════════════════════════════════════════
        _renderQR(elId, text) {
            const el = document.getElementById(elId);
            if (!el || typeof QRCode === 'undefined') return;
            el.innerHTML = '';
            new QRCode(el, { text: text || '-', width: 160, height: 160, colorDark: '#0f172a', colorLight: '#ffffff' });
        },

        openKartuAnggota(p) {
            if (!p) {
                Swal.fire('Info', 'Data penghuni Anda belum terhubung. Silakan hubungi admin.', 'info');
                return;
            }
            this.kartuPenghuni = p;
            this.kartuModalOpen = true;
            this.$nextTick(() => this._renderQR('qr-kartu-anggota', p.nik));
        },

        downloadKartu(canvasId, nik) {
            const elId = canvasId || 'qr-kartu-anggota';
            const targetNik = nik || (this.kartuPenghuni ? this.kartuPenghuni.nik : this.currentNik);
            const el = document.getElementById(elId);
            const img = el ? el.querySelector('img') : null;
            const canvas = el ? el.querySelector('canvas') : null;
            const src = img ? img.src : (canvas ? canvas.toDataURL('image/png') : null);
            if (!src) { Swal.fire('Gagal', 'QR belum siap, coba lagi sesaat lagi.', 'error'); return; }
            const a = document.createElement('a');
            a.href = src;
            a.download = `kartu-${targetNik || 'anggota'}.png`;
            document.body.appendChild(a);
            a.click();
            a.remove();
        },

        // ══════════════════════════════════════════════
        // IZIN KELUAR / MASUK
        // ══════════════════════════════════════════════
        openAjukanIzin() {
            this.izinForm = {
                nik: this.currentRole === 'penghuni' ? this.currentNik : '',
                tujuan: '',
                tanggalKeluar: '',
                estimasiKembali: ''
            };
            this.izinModalOpen = true;
        },

        simpanIzin() {
            if (!this.izinForm.nik || !this.izinForm.tujuan || !this.izinForm.tanggalKeluar || !this.izinForm.estimasiKembali) {
                Swal.fire('Lengkapi Data', 'Semua field wajib diisi.', 'warning');
                return;
            }
            const rec = {
                id: Date.now(),
                nik: this.izinForm.nik,
                tujuan: this.izinForm.tujuan,
                tanggalKeluar: this.izinForm.tanggalKeluar,
                estimasiKembali: this.izinForm.estimasiKembali,
                status: 'menunggu',
                catatanAdmin: '',
                diajukanPada: new Date().toISOString()
            };
            this.izin.unshift(rec);
            this.saveExtraData();
            this._tambahNotifikasi({
                tipe: 'izin',
                judul: 'Pengajuan Izin Baru',
                pesan: `${this.namaPenghuniByNik(rec.nik)} mengajukan izin: ${rec.tujuan}`,
                untukRole: ['admin', 'pembina']
            });
            this.izinModalOpen = false;
            Swal.fire({ icon: 'success', title: 'Izin Diajukan', text: 'Menunggu persetujuan admin/pembina.', timer: 1800, showConfirmButton: false });
        },

        showIzinDetail(iz) {
            this.selectedIzin = iz;
            this.izinDetailOpen = true;
        },

        setujuiIzin(iz) {
            if (!iz) return;
            iz.status = 'disetujui';
            this.saveExtraData();
            this._tambahNotifikasi({ tipe: 'izin', judul: 'Izin Disetujui', pesan: `Izin ${this.namaPenghuniByNik(iz.nik)} telah disetujui.`, untukNik: iz.nik });
            this.izinDetailOpen = false;
        },

        tolakIzin(iz) {
            if (!iz) return;
            Swal.fire({ title: 'Tolak pengajuan izin ini?', icon: 'warning', showCancelButton: true, confirmButtonText: 'Ya, tolak', confirmButtonColor: '#ef4444' })
                .then(r => {
                    if (r.isConfirmed) {
                        iz.status = 'ditolak';
                        this.saveExtraData();
                        this._tambahNotifikasi({ tipe: 'izin', judul: 'Izin Ditolak', pesan: `Izin ${this.namaPenghuniByNik(iz.nik)} ditolak.`, untukNik: iz.nik });
                        this.izinDetailOpen = false;
                    }
                });
        },

        tandaiKembali(iz) {
            if (!iz) return;
            iz.status = 'selesai';
            iz.kembaliAktual = new Date().toISOString();
            this.saveExtraData();
            this.izinDetailOpen = false;
        },

        // ══════════════════════════════════════════════
        // PELANGGARAN
        // ══════════════════════════════════════════════
        openAddPelanggaranModal() {
            this.isEditPelanggaran = false;
            this.pelanggaranForm = { nik: '', jenis: '', tanggal: new Date().toISOString().slice(0, 10), keterangan: '', sanksi: '' };
            this.pelanggaranModalOpen = true;
        },

        openEditPelanggaranModal(p) {
            this.isEditPelanggaran = true;
            this.pelanggaranForm = { ...p };
            this.pelanggaranModalOpen = true;
        },

        simpanPelanggaran() {
            if (!this.pelanggaranForm.nik || !this.pelanggaranForm.jenis) {
                Swal.fire('Lengkapi Data', 'Penghuni dan jenis pelanggaran wajib diisi.', 'warning');
                return;
            }
            if (this.isEditPelanggaran) {
                const idx = this.pelanggaran.findIndex(x => x.id === this.pelanggaranForm.id);
                if (idx !== -1) this.pelanggaran[idx] = { ...this.pelanggaranForm };
            } else {
                const rec = { id: Date.now(), status: 'proses', ...this.pelanggaranForm };
                this.pelanggaran.unshift(rec);
                this._tambahNotifikasi({
                    tipe: 'pelanggaran',
                    judul: 'Pelanggaran Baru',
                    pesan: `${this.namaPenghuniByNik(rec.nik)}: ${rec.jenis}`,
                    untukRole: ['admin', 'pembina'],
                    untukNik: rec.nik
                });
            }
            this.saveExtraData();
            this.pelanggaranModalOpen = false;
        },

        selesaikanPelanggaran(p) {
            p.status = 'selesai';
            this.saveExtraData();
        },

        deletePelanggaran(p) {
            Swal.fire({ title: 'Hapus catatan pelanggaran ini?', icon: 'warning', showCancelButton: true, confirmButtonText: 'Hapus', confirmButtonColor: '#ef4444' })
                .then(r => {
                    if (r.isConfirmed) {
                        this.pelanggaran = this.pelanggaran.filter(x => x.id !== p.id);
                        this.saveExtraData();
                    }
                });
        },

        // ══════════════════════════════════════════════
        // AKTIVITAS ASRAMA
        // ══════════════════════════════════════════════
        openAddAktivitasModal() {
            this.isEditAktivitas = false;
            this.aktivitasForm = { judul: '', jenis: 'kebersihan', tanggal: new Date().toISOString().slice(0, 10), deskripsi: '' };
            this.aktivitasModalOpen = true;
        },

        openEditAktivitasModal(a) {
            this.isEditAktivitas = true;
            this.aktivitasForm = { ...a };
            this.aktivitasModalOpen = true;
        },

        simpanAktivitas() {
            if (!this.aktivitasForm.judul) {
                Swal.fire('Lengkapi Data', 'Judul kegiatan wajib diisi.', 'warning');
                return;
            }
            if (this.isEditAktivitas) {
                const idx = this.aktivitas.findIndex(x => x.id === this.aktivitasForm.id);
                if (idx !== -1) this.aktivitas[idx] = { ...this.aktivitasForm };
            } else {
                const rec = { id: Date.now(), ...this.aktivitasForm };
                this.aktivitas.unshift(rec);
                this._tambahNotifikasi({
                    tipe: 'aktivitas',
                    judul: 'Kegiatan Baru',
                    pesan: rec.judul,
                    untukRole: ['admin', 'pembina', 'penghuni', 'pimpinan']
                });
            }
            this.saveExtraData();
            this.aktivitasModalOpen = false;
        },

        deleteAktivitas(a) {
            Swal.fire({ title: 'Hapus kegiatan ini?', icon: 'warning', showCancelButton: true, confirmButtonText: 'Hapus', confirmButtonColor: '#ef4444' })
                .then(r => {
                    if (r.isConfirmed) {
                        this.aktivitas = this.aktivitas.filter(x => x.id !== a.id);
                        this.saveExtraData();
                    }
                });
        },

        // ══════════════════════════════════════════════
        // MANAJEMEN PENGGUNA
        // ══════════════════════════════════════════════
        openAddUserModal() {
            this.isEditUser = false;
            this.userForm = { username: '', password: '', nama: '', role: 'penghuni', nik: '', active: true };
            this.userModalOpen = true;
        },

        openEditUserModal(u) {
            this.isEditUser = true;
            this.userForm = { ...u };
            this.userModalOpen = true;
        },

        simpanUser() {
            if (!this.userForm.username || !this.userForm.password || !this.userForm.nama) {
                Swal.fire('Lengkapi Data', 'Username, kata sandi, dan nama wajib diisi.', 'warning');
                return;
            }
            const uname = this.userForm.username.trim().toLowerCase();
            const dup = this.users.find(u => u.username.toLowerCase() === uname && u.id !== this.userForm.id);
            if (dup) {
                Swal.fire('Gagal', 'Username sudah digunakan oleh akun lain.', 'error');
                return;
            }
            if (this.isEditUser) {
                const idx = this.users.findIndex(x => x.id === this.userForm.id);
                if (idx !== -1) this.users[idx] = { ...this.userForm };
            } else {
                this.users.push({ id: Date.now(), ...this.userForm });
            }
            this.saveExtraData();
            this.userModalOpen = false;
        },

        toggleUserActive(u) {
            u.active = !u.active;
            this.saveExtraData();
        },

        deleteUser(u) {
            if (u.username === this.currentUsername) {
                Swal.fire('Tidak Diizinkan', 'Anda tidak dapat menghapus akun yang sedang digunakan.', 'warning');
                return;
            }
            Swal.fire({ title: 'Hapus akun ini?', icon: 'warning', showCancelButton: true, confirmButtonText: 'Hapus', confirmButtonColor: '#ef4444' })
                .then(r => {
                    if (r.isConfirmed) {
                        this.users = this.users.filter(x => x.id !== u.id);
                        this.saveExtraData();
                    }
                });
        },

        // ══════════════════════════════════════════════
        // CHART MANAGEMENT
        // ══════════════════════════════════════════════
        chartInstances: {},

        _destroyChart(canvasId) {
            const instance = this.chartInstances[canvasId];
            if (!instance) return;
            try { if (instance.animating) instance.stop(); instance.destroy(); } catch (e) { /* abaikan */ }
            delete this.chartInstances[canvasId];
        },

        _destroyAllCharts() {
            Object.keys(this.chartInstances).forEach(id => this._destroyChart(id));
        },

        _isCanvasReady(canvasId) {
            const canvas = document.getElementById(canvasId);
            if (!canvas) return false;
            let el = canvas;
            while (el && el !== document.body) {
                const style = window.getComputedStyle(el);
                if (style.display === 'none' || style.visibility === 'hidden') return false;
                el = el.parentElement;
            }
            return !(canvas.offsetWidth === 0 && canvas.offsetHeight === 0);
        },

        // ══════════════════════════════════════════════
        // INIT
        // ══════════════════════════════════════════════
        init() {
            const isLoggedIn = localStorage.getItem('isLoggedIn');
            if (!isLoggedIn || isLoggedIn !== 'true') {
                window.location.replace('login.html');
                return;
            }
            this.loadFromStorage();
            this.loadUserData();
            this.loadExtraData();
            this.updateDarkMode();

            // Jika halaman awal tidak diizinkan untuk role ini, alihkan ke dashboard
            if (!this.hasAccess(this.currentPage)) this.currentPage = 'dashboard';

            this.$watch('penghuni', () => this.saveToStorage());
            this.$watch('barak', () => {
                this.saveToStorage();
                if (this.currentPage === 'dashboard' || this.currentPage === 'laporan')
                    this._scheduleChartRender();
            });
            this.$watch('inventaris', () => this.saveToStorage());
            this.$watch('userProfile', () => this.saveUserData());
            this.$watch('settings', () => this.saveUserData());
            this.$watch('presensi', () => this.saveExtraData());
            this.$watch('izin', () => this.saveExtraData());
            this.$watch('pelanggaran', () => this.saveExtraData());
            this.$watch('aktivitas', () => this.saveExtraData());
            this.$watch('users', () => this.saveExtraData());
            this.$watch('notifikasi', () => this.saveExtraData());
            this.$watch('darkMode', () => {
                this.updateDarkMode(); this.saveUserData();
                if (this.currentPage === 'dashboard' || this.currentPage === 'laporan')
                    this._scheduleChartRender();
            });
            this.$watch('currentPage', () => {
                this._destroyAllCharts();
                this._stopQrScanner();
                this.dashboardScannerActive = false;
                if (this.currentPage === 'dashboard' || this.currentPage === 'laporan')
                    this._scheduleChartRender();
                if (this.currentPage === 'dashboard' && this.currentRole === 'penghuni') {
                    this.$nextTick(() => this._renderQR('qr-dashboard-penghuni', this.currentNik));
                }
            });

            this._scheduleChartRender(600);

            this.$nextTick(() => {
                if (this.currentPage === 'dashboard' && this.currentRole === 'penghuni') {
                    this._renderQR('qr-dashboard-penghuni', this.currentNik);
                }
                setTimeout(() => {
                    const loader = document.getElementById('page-loader');
                    if (loader) { loader.style.opacity = '0'; setTimeout(() => loader.remove(), 800); }
                }, 2800);
            });
        },

        _chartRenderTimer: null,

        _scheduleChartRender(delay = 200) {
            if (this._chartRenderTimer) clearTimeout(this._chartRenderTimer);
            this._chartRenderTimer = setTimeout(() => {
                this._chartRenderTimer = null;
                this.$nextTick(() => this.renderAllCharts());
            }, delay);
        },

        // ══════════════════════════════════════════════
        // RENDER CHART
        // ══════════════════════════════════════════════
        renderDonutChart(canvasId, labels, data, colors, centerText = '') {
            if (!this._isCanvasReady(canvasId)) return;
            const canvas = document.getElementById(canvasId);
            this._destroyChart(canvasId);
            const total = data.reduce((a, b) => a + b, 0);
            if (total === 0) {
                try { const ctx = canvas.getContext('2d'); if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height); } catch (e) { }
                return;
            }
            try {
                const isDark = this.darkMode;
                const textColor = isDark ? '#e2e8f0' : '#1e293b';
                const chart = new Chart(canvas, {
                    type: 'doughnut',
                    data: { labels, datasets: [{ data, backgroundColor: colors, borderColor: isDark ? '#1e293b' : '#ffffff', borderWidth: 3, hoverOffset: 8 }] },
                    options: {
                        responsive: true, maintainAspectRatio: true, cutout: '68%', onResize: null,
                        plugins: {
                            legend: { position: 'bottom', labels: { color: textColor, font: { size: 12, family: "'DM Sans', sans-serif" }, padding: 16, usePointStyle: true, pointStyleWidth: 10 } },
                            tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.parsed} (${total > 0 ? Math.round((ctx.parsed / total) * 100) : 0}%)` } }
                        },
                        animation: { animateRotate: true, duration: 600, easing: 'easeInOutQuart' }
                    },
                    plugins: [{
                        id: 'centerText_' + canvasId,
                        afterDraw(chart) {
                            if (!centerText) return;
                            const { ctx, chartArea } = chart;
                            if (!chartArea) return;
                            const cx = chartArea.left + chartArea.width / 2;
                            const cy = chartArea.top + chartArea.height / 2 - 10;
                            ctx.save();
                            ctx.font = `bold 28px 'DM Sans', sans-serif`; ctx.fillStyle = textColor;
                            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                            ctx.fillText(centerText, cx, cy);
                            ctx.font = `13px 'DM Sans', sans-serif`; ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
                            ctx.fillText('Total', cx, cy + 22);
                            ctx.restore();
                        }
                    }]
                });
                this.chartInstances[canvasId] = chart;
            } catch (e) {
                console.warn(`Chart render gagal untuk #${canvasId}:`, e.message);
                delete this.chartInstances[canvasId];
            }
        },

        renderAllCharts() {
            if (this.currentPage === 'dashboard') {
                const sd = this.laporanStatus;
                this.renderDonutChart('chart-status-penghuni', sd.map(s => s.label), sd.map(s => s.jumlah), sd.map(s => s.warna), String(this.penghuni.length));
                const hd = this.laporanHunianBarak;
                this.renderDonutChart('chart-hunian-barak', hd.map(h => h.label), hd.map(h => h.jumlah), hd.map(h => h.warna), this.hunianPersen + '%');
                return;
            }
            if (this.currentPage === 'laporan') {
                if (this.laporanDistrik.length > 0) {
                    const colors = ['#3b82f6', '#8b5cf6', '#22c55e', '#f97316', '#ef4444', '#06b6d4', '#eab308', '#ec4899'];
                    this.renderDonutChart('chart-laporan-distrik', this.laporanDistrik.map(d => d.distrik), this.laporanDistrik.map(d => d.jumlah), colors.slice(0, this.laporanDistrik.length), String(this.penghuniAktif));
                }
                if (this.laporanJenjang.length > 0) {
                    this.renderDonutChart('chart-laporan-jenjang', this.laporanJenjang.map(j => j.jenjang), this.laporanJenjang.map(j => j.jumlah), ['#3b82f6', '#f97316', '#22c55e', '#8b5cf6'], String(this.penghuniAktif));
                }
                this.renderDonutChart('chart-laporan-inventaris', ['Baik', 'Rusak Ringan', 'Rusak Berat'], [this.totalBaik, this.totalRusakRingan, this.totalRusakBerat], ['#22c55e', '#f97316', '#ef4444'], String(this.totalInventaris));
            }
        },

        // ══════════════════════════════════════════════
        // DARK MODE & NAVIGASI
        // ══════════════════════════════════════════════
        updateDarkMode() {
            document.documentElement.classList.toggle('dark', this.darkMode);
            localStorage.theme = this.darkMode ? 'dark' : 'light';
        },
        toggleDarkMode() { this.darkMode = !this.darkMode; },
        setPage(page) {
            if (this.currentPage === page) return;
            this.currentPage = page;
            if (window.innerWidth < 1024) this.sidebarOpen = false;
        },

        // ══════════════════════════════════════════════
        // UI HELPERS
        // ══════════════════════════════════════════════
        toggleNotifications() { this.notificationsOpen = !this.notificationsOpen; this.profileOpen = false; },
        toggleProfile() { this.profileOpen = !this.profileOpen; this.notificationsOpen = false; },
        closeDropdowns(event) {
            if (!event.target.closest('.dropdown')) { this.notificationsOpen = false; this.profileOpen = false; }
        },
        getKamarSaatIni(p) {
            if (!p.kamarSaatIni) return null;
            const b = this.barak.find(b => b.id === p.kamarSaatIni.barakId);
            if (!b) return 'Data kamar hilang';
            return `${p.kamarSaatIni.nomorKamar} — ${b.sisi} Lt.${b.lantai}`;
        },

        // ══════════════════════════════════════════════
        // CRUD PENGHUNI
        // ══════════════════════════════════════════════
        openAddModal() {
            this.isEditMode = false;
            this.form = { nik: '', nama: '', nisn_nim: '', distrik: '', jenjang: 'SMA', tahun_masuk: new Date().getFullYear(), jenis_kelamin: '', no_hp: '', status: 'aktif', kamarSaatIni: null, tanggalKeluar: null };
            this.modalOpen = true;
        },
        openEditModal(penghuni) {
            this.isEditMode = true;
            this.form = { ...penghuni };
            this.modalOpen = true;
        },
        savePenghuni() {
            if (!this.form.nik?.trim()) return Swal.fire('Error', 'NIK wajib diisi', 'error');
            if (!this.form.nama?.trim()) return Swal.fire('Error', 'Nama wajib diisi', 'error');
            if (!this.isEditMode && this.penghuni.some(p => p.nik === this.form.nik.trim()))
                return Swal.fire('Error', 'NIK sudah terdaftar!', 'error');

            Swal.fire({ title: this.isEditMode ? 'Simpan Perubahan?' : 'Tambah Penghuni Baru?', icon: 'question', showCancelButton: true, confirmButtonColor: '#3b82f6', cancelButtonText: 'Batal', confirmButtonText: 'Ya, Simpan' })
                .then(r => {
                    if (!r.isConfirmed) return;
                    const data = { ...this.form };
                    data.nik = data.nik.trim();
                    if (this.isEditMode && data.status !== 'aktif') {
                        const lama = this.penghuni.find(p => p.nik === data.nik);
                        if (lama && lama.status === 'aktif' && lama.kamarSaatIni) {
                            this._kosongkanKamarDariPenghuni(lama.nik);
                            data.kamarSaatIni = null;
                        }
                        if (!data.tanggalKeluar) data.tanggalKeluar = new Date().toISOString().split('T')[0];
                    }
                    this.penghuni = this.isEditMode
                        ? this.penghuni.map(p => p.nik === data.nik ? data : p)
                        : [data, ...this.penghuni];
                    this.modalOpen = false;
                    if (this.currentPage === 'dashboard' || this.currentPage === 'laporan') this._scheduleChartRender();
                    Swal.fire({ icon: 'success', title: 'Berhasil!', text: 'Data tersimpan', timer: 1500, showConfirmButton: false });
                });
        },

        _kosongkanKamarDariPenghuni(nik) {
            const newBarak = JSON.parse(JSON.stringify(this.barak));
            newBarak.forEach(b => {
                b.daftarKamar.forEach(k => {
                    const idx = (k.penghuniList || []).indexOf(nik);
                    if (idx !== -1) {
                        const lastR = (k.riwayat || []).slice().reverse().find(rv => rv.nik === nik && !rv.tanggalKeluar);
                        if (lastR) { lastR.tanggalKeluar = new Date().toISOString().split('T')[0]; lastR.status = 'keluar'; }
                        k.penghuniList.splice(idx, 1);
                        this._updateStatusKamar(k);
                    }
                });
                this._updateStatusBarak(b);
            });
            this.barak = newBarak;
        },

        // ══════════════════════════════════════════════
        // RIWAYAT PENGHUNI
        // ══════════════════════════════════════════════
        showRiwayat(penghuni) {
            this.selectedPenghuni = penghuni;
            this.selectedRiwayat = [];
            this.barak.forEach(b => {
                b.daftarKamar.forEach(k => {
                    (k.riwayat || []).forEach(r => {
                        if (r.nik === penghuni.nik) {
                            this.selectedRiwayat.push({
                                kamar: k.nomor, barak: `${b.sisi} Lt.${b.lantai}`,
                                tanggalMasuk: r.tanggalMasuk || '-', tanggalKeluar: r.tanggalKeluar || null,
                                status: r.tanggalKeluar ? 'Riwayat' : 'Saat Ini'
                            });
                        }
                    });
                });
            });
            if (!this.selectedRiwayat.length && penghuni.kamarSaatIni) {
                const b = this.barak.find(b => b.id === penghuni.kamarSaatIni.barakId);
                if (b) this.selectedRiwayat = [{ kamar: penghuni.kamarSaatIni.nomorKamar, barak: `${b.sisi} Lt.${b.lantai}`, tanggalMasuk: penghuni.kamarSaatIni.tanggalMasuk || '-', tanggalKeluar: null, status: 'Saat Ini' }];
            }
            this.riwayatOpen = true;
        },

        // ══════════════════════════════════════════════
        // CRUD BARAK
        // ══════════════════════════════════════════════
        openAddBarakModal() {
            this.isEditBarak = false;
            this.barakForm = { lantai: 1, sisi: '', kapasitas: 7 };
            this.barakModalOpen = true;
        },
        openEditBarakModal(barak) {
            this.isEditBarak = true;
            this.barakForm = { id: barak.id, lantai: barak.lantai, sisi: barak.sisi, kapasitas: barak.kapasitas };
            this.barakModalOpen = true;
        },
        saveBarak() {
            if (!this.barakForm.sisi?.trim()) return Swal.fire('Error', 'Nama/sisi barak wajib diisi', 'error');
            if (!this.barakForm.lantai || isNaN(this.barakForm.lantai)) return Swal.fire('Error', 'Lantai harus berupa angka', 'error');
            if (!this.barakForm.kapasitas || Number(this.barakForm.kapasitas) < 1) return Swal.fire('Error', 'Kapasitas minimal 1 kamar', 'error');

            Swal.fire({ title: this.isEditBarak ? 'Simpan Perubahan Barak?' : 'Tambah Barak Baru?', icon: 'question', showCancelButton: true, confirmButtonColor: '#3b82f6', cancelButtonText: 'Batal', confirmButtonText: 'Ya, Simpan' })
                .then(r => {
                    if (!r.isConfirmed) return;
                    const kap = Number(this.barakForm.kapasitas);
                    const lt = Number(this.barakForm.lantai);

                    if (this.isEditBarak) {
                        const idx = this.barak.findIndex(b => b.id === this.barakForm.id);
                        if (idx === -1) return;
                        const existing = this.barak[idx];
                        let daftarKamar = JSON.parse(JSON.stringify(existing.daftarKamar));
                        const oldKap = daftarKamar.length;
                        if (kap > oldKap) {
                            for (let i = oldKap; i < kap; i++) {
                                daftarKamar.push({ nomor: this._generateNomorKamar(lt, i + 1), status: 'kosong', penghuniList: [], tanggalMasuk: null, riwayat: [] });
                            }
                        } else if (kap < oldKap) {
                            const adaPenghuni = daftarKamar.slice(kap).some(k => (k.penghuniList || []).length > 0);
                            if (adaPenghuni) return Swal.fire('Error', 'Tidak bisa mengurangi kamar. Beberapa kamar yang akan dihapus masih berisi penghuni.', 'error');
                            daftarKamar = daftarKamar.slice(0, kap);
                        }
                        daftarKamar.forEach(k => this._updateStatusKamar(k));
                        const newBarak = { ...existing, sisi: this.barakForm.sisi.trim(), lantai: lt, kapasitas: kap, daftarKamar, rentangKamar: daftarKamar.length ? `${daftarKamar[0].nomor}–${daftarKamar[daftarKamar.length - 1].nomor}` : '-' };
                        this._updateStatusBarak(newBarak);
                        this.barak = this.barak.map((b, i) => i === idx ? newBarak : b);
                    } else {
                        const existingKamarCount = this.barak.filter(b => b.lantai === lt).reduce((s, b) => s + b.daftarKamar.length, 0);
                        const daftarKamar = Array.from({ length: kap }, (_, i) => ({ nomor: this._generateNomorKamar(lt, existingKamarCount + i + 1), status: 'kosong', penghuniList: [], tanggalMasuk: null, riwayat: [] }));
                        const newBarak = { id: Date.now(), lantai: lt, sisi: this.barakForm.sisi.trim(), kapasitas: kap, terisi: 0, status: 'kosong', rentangKamar: `${daftarKamar[0].nomor}–${daftarKamar[daftarKamar.length - 1].nomor}`, daftarKamar };
                        this.barak = [...this.barak, newBarak];
                    }
                    this.barakModalOpen = false;
                    Swal.fire({ icon: 'success', title: 'Berhasil!', text: 'Data barak tersimpan', timer: 1500, showConfirmButton: false });
                });
        },

        _generateNomorKamar(lantai, urut) {
            return `${lantai}${String(urut).padStart(2, '0')}`;
        },

        deleteBarak(barak) {
            const adaPenghuni = (barak.daftarKamar || []).some(k => (k.penghuniList || []).length > 0);
            if (adaPenghuni) return Swal.fire('Tidak Bisa Dihapus', 'Masih ada penghuni di barak ini. Keluarkan semua penghuni terlebih dahulu.', 'warning');
            Swal.fire({ title: 'Hapus Barak?', text: `Yakin hapus barak "${barak.sisi} Lantai ${barak.lantai}"?`, icon: 'warning', showCancelButton: true, confirmButtonColor: '#ef4444', confirmButtonText: 'Ya, Hapus', cancelButtonText: 'Batal' })
                .then(r => {
                    if (r.isConfirmed) { this.barak = this.barak.filter(b => b.id !== barak.id); Swal.fire({ icon: 'success', title: 'Terhapus!', timer: 1500, showConfirmButton: false }); }
                });
        },

        // ══════════════════════════════════════════════
        // ASSIGN PENGHUNI ke kamar (mendukung multi-penghuni)
        // ══════════════════════════════════════════════
        openAssignModal(barak) {
            this.assignSelectedBarakId = (barak && barak.id != null) ? String(barak.id) : '';
            this.selectedPenghuniId = '';
            this.assignSelectedKamarNomor = '';
            this.selectedKamar = barak || null;
            this.assignModalOpen = true;
        },
        onAssignBarakChange() { this.assignSelectedKamarNomor = ''; },

        assignPenghuni() {
            if (!this.selectedPenghuniId) return Swal.fire('Peringatan', 'Pilih penghuni terlebih dahulu.', 'warning');
            if (!this.assignSelectedBarakId) return Swal.fire('Peringatan', 'Pilih barak terlebih dahulu.', 'warning');
            if (!this.assignSelectedKamarNomor) return Swal.fire('Peringatan', 'Pilih kamar terlebih dahulu.', 'warning');

            const penghuni = this.penghuni.find(p => p.nik === this.selectedPenghuniId);
            if (!penghuni) return Swal.fire('Error', 'Penghuni tidak ditemukan.', 'error');
            if (penghuni.status !== 'aktif') return Swal.fire('Peringatan', 'Hanya penghuni aktif yang bisa ditempatkan.', 'warning');
            if (penghuni.kamarSaatIni) return Swal.fire('Peringatan', `${penghuni.nama} sudah menempati kamar lain.`, 'warning');

            const barakIdx = this.barak.findIndex(b => String(b.id) === String(this.assignSelectedBarakId));
            if (barakIdx === -1) return Swal.fire('Error', 'Barak tidak ditemukan.', 'error');

            const barak = this.barak[barakIdx];
            const kamarIdx = barak.daftarKamar.findIndex(k => k.nomor === this.assignSelectedKamarNomor);
            if (kamarIdx === -1) return Swal.fire('Error', 'Kamar tidak ditemukan.', 'error');

            const kamar = barak.daftarKamar[kamarIdx];
            if (!this._kamarBisaDisisi(kamar)) {
                return Swal.fire('Error', `Kamar ${kamar.nomor} sudah penuh (maks. ${this.MAX_PENGHUNI_PER_KAMAR} penghuni).`, 'error');
            }

            const jumlahSaatIni = this._jumlahPenghuniKamar(kamar);
            const sisaSlot = this.MAX_PENGHUNI_PER_KAMAR - jumlahSaatIni;

            Swal.fire({
                title: 'Konfirmasi Penempatan',
                html: `<b>${penghuni.nama}</b> akan ditempatkan di kamar <b>${this.assignSelectedKamarNomor}</b><br>
                       <small>${barak.sisi} – Lantai ${barak.lantai}</small><br>
                       <span class="inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold" style="background:#dbeafe;color:#1d4ed8">
                         Penghuni: ${jumlahSaatIni} → ${jumlahSaatIni + 1} / ${this.MAX_PENGHUNI_PER_KAMAR} &nbsp;|&nbsp; Sisa slot: ${sisaSlot - 1}
                       </span>`,
                icon: 'question', showCancelButton: true,
                confirmButtonColor: '#3b82f6', confirmButtonText: 'Ya, Tempatkan', cancelButtonText: 'Batal'
            }).then(r => {
                if (!r.isConfirmed) return;
                this.assigning = true;

                const tanggal = new Date().toISOString().split('T')[0];
                const newBarak = JSON.parse(JSON.stringify(this.barak));
                const tBarak = newBarak[barakIdx];
                const tKamar = tBarak.daftarKamar[kamarIdx];

                tKamar.penghuniList = tKamar.penghuniList || [];
                tKamar.penghuniList.push(penghuni.nik);
                tKamar.riwayat = tKamar.riwayat || [];
                tKamar.riwayat.push({ nik: penghuni.nik, nama: penghuni.nama, tanggalMasuk: tanggal, tanggalKeluar: null, status: 'aktif' });

                this._updateStatusKamar(tKamar);
                this._updateStatusBarak(tBarak);

                this.barak = newBarak;
                this.penghuni = this.penghuni.map(p =>
                    p.nik === penghuni.nik
                        ? { ...p, kamarSaatIni: { barakId: tBarak.id, nomorKamar: tKamar.nomor, tanggalMasuk: tanggal } }
                        : p
                );

                this.assignModalOpen = false;
                this.selectedPenghuniId = '';
                this.assignSelectedBarakId = '';
                this.assignSelectedKamarNomor = '';
                this.selectedKamar = null;
                this.assigning = false;

                Swal.fire({ icon: 'success', title: 'Berhasil!', text: `${penghuni.nama} ditempatkan di kamar ${tKamar.nomor} – ${tBarak.sisi}`, timer: 2000, showConfirmButton: false });
                if (this.currentPage === 'dashboard' || this.currentPage === 'laporan') this._scheduleChartRender();
            });
        },

        kosongkanSatuPenghuni(barak, kamar, nik) {
            const penghuni = this.penghuni.find(p => p.nik === nik);
            const nama = penghuni?.nama || '(data hilang)';

            Swal.fire({
                title: 'Keluarkan Penghuni?',
                text: `Keluarkan ${nama} dari kamar ${kamar.nomor}?`,
                icon: 'warning', showCancelButton: true,
                confirmButtonColor: '#ef4444', confirmButtonText: 'Ya, Keluarkan', cancelButtonText: 'Batal'
            }).then(r => {
                if (!r.isConfirmed) return;

                const barakIdx = this.barak.findIndex(b => b.id === barak.id);
                if (barakIdx === -1) return;

                const newBarak = JSON.parse(JSON.stringify(this.barak));
                const tBarak = newBarak[barakIdx];
                const tKamar = tBarak.daftarKamar.find(k => k.nomor === kamar.nomor);
                if (!tKamar) return;

                const nikIdx = (tKamar.penghuniList || []).indexOf(nik);
                if (nikIdx !== -1) tKamar.penghuniList.splice(nikIdx, 1);

                const lastR = (tKamar.riwayat || []).slice().reverse().find(rv => rv.nik === nik && !rv.tanggalKeluar);
                if (lastR) { lastR.tanggalKeluar = new Date().toISOString().split('T')[0]; lastR.status = 'keluar'; }

                this._updateStatusKamar(tKamar);
                this._updateStatusBarak(tBarak);
                this.barak = newBarak;

                if (this.selectedDetailBarak && this.selectedDetailBarak.id === tBarak.id) {
                    this.selectedDetailBarak = tBarak;
                }

                if (penghuni) {
                    this.penghuni = this.penghuni.map(p => p.nik === nik ? { ...p, kamarSaatIni: null } : p);
                }

                Swal.fire({ icon: 'success', title: 'Berhasil', text: `${nama} dikeluarkan dari kamar ${kamar.nomor}`, timer: 1500, showConfirmButton: false });
                if (this.currentPage === 'dashboard' || this.currentPage === 'laporan') this._scheduleChartRender();
            });
        },

        openDetailKamarModal(barak) {
            this.selectedDetailBarak = barak;
            this.detailKamarOpen = true;
        },

        showRiwayatKamar(barak) {
            if (!barak || !Array.isArray(barak.daftarKamar)) return Swal.fire('Error', 'Data barak tidak valid', 'error');
            this.selectedKamarRiwayat = barak;
            const all = [];
            barak.daftarKamar.forEach(kamar => {
                (kamar.riwayat || []).forEach(entry => {
                    all.push({
                        kamar: kamar.nomor, penghuni: entry.nama || '(hilang)',
                        periode: entry.tanggalKeluar ? `${entry.tanggalMasuk} – ${entry.tanggalKeluar}` : `${entry.tanggalMasuk} – Sekarang`,
                        status: entry.tanggalKeluar ? 'keluar' : 'aktif'
                    });
                });
            });
            all.sort((a, b) => new Date(b.periode.split(' – ')[0]) - new Date(a.periode.split(' – ')[0]));
            this.selectedRiwayatKamar = all;
            this.riwayatKamarOpen = true;
        },

        // ══════════════════════════════════════════════
        // CRUD INVENTARIS
        // ══════════════════════════════════════════════
        openAddInventarisModal() {
            this.isEditInventaris = false;
            this.inventarisForm = { barakId: '', nomorKamar: '', jenis: '', jumlahTotal: '', baik: '', rusakRingan: '', rusakBerat: '', catatan: '' };
            this.daftarKamarPilihan = [];
            this.inventarisModalOpen = true;
        },
        openEditInventarisModal(item) {
            this.isEditInventaris = true;
            this.inventarisForm = { ...item };
            this.updateDaftarKamar();
            this.inventarisModalOpen = true;
        },
        updateDaftarKamar() {
            this.daftarKamarPilihan = [];
            if (!this.inventarisForm.barakId) return;
            const b = this.barak.find(b => String(b.id) === String(this.inventarisForm.barakId));
            if (b?.daftarKamar) this.daftarKamarPilihan = b.daftarKamar;
        },
        saveInventaris() {
            if (!this.inventarisForm.barakId || !this.inventarisForm.jenis?.trim())
                return Swal.fire('Error', 'Barak dan jenis inventaris wajib diisi', 'error');
            Swal.fire({ title: this.isEditInventaris ? 'Simpan perubahan?' : 'Tambah inventaris?', icon: 'question', showCancelButton: true, confirmButtonColor: '#3b82f6', cancelButtonText: 'Batal' })
                .then(r => {
                    if (!r.isConfirmed) return;
                    const b = this.barak.find(b => String(b.id) === String(this.inventarisForm.barakId));
                    const barakName = b ? `${b.sisi} – Lt.${b.lantai}` : 'Tidak diketahui';
                    this.inventaris = this.isEditInventaris
                        ? this.inventaris.map(i => i.id === this.inventarisForm.id ? { ...this.inventarisForm, barak: barakName } : i)
                        : [...this.inventaris, { id: Date.now(), barak: barakName, ...this.inventarisForm }];
                    this.inventarisModalOpen = false;
                    if (this.currentPage === 'dashboard' || this.currentPage === 'laporan') this._scheduleChartRender();
                    Swal.fire({ icon: 'success', title: 'Sukses', text: 'Data inventaris tersimpan', timer: 1500, showConfirmButton: false });
                });
        },

        // ══════════════════════════════════════════════
        // PROFIL & PENGATURAN
        // ══════════════════════════════════════════════
        openProfileModal(tab = 'profile') { this.activeTab = tab; this.profileModalOpen = true; },
        uploadPhoto(event) {
            const file = event.target.files[0];
            if (!file?.type.startsWith('image/')) return Swal.fire('Error', 'Hanya file gambar yang diperbolehkan', 'error');
            const reader = new FileReader();
            reader.onload = e => { this.userProfile = { ...this.userProfile, photo: e.target.result }; };
            reader.readAsDataURL(file);
        },
        saveProfile() {
            if (!this.userProfile.name?.trim() || !this.userProfile.email?.trim()) return Swal.fire('Error', 'Nama dan Email wajib diisi', 'error');
            this.saving = true;
            setTimeout(() => { this.saveUserData(); this.saving = false; this.profileModalOpen = false; Swal.fire({ icon: 'success', title: 'Berhasil!', text: 'Profil diperbarui', timer: 1500, showConfirmButton: false }); }, 800);
        },
        saveSettings() {
            if (this.settings.newPassword || this.settings.oldPassword) {
                if (this.settings.newPassword !== this.settings.confirmPassword) return Swal.fire('Error', 'Konfirmasi kata sandi tidak cocok', 'error');
                if (this.settings.newPassword.length < 6) return Swal.fire('Error', 'Kata sandi minimal 6 karakter', 'error');
            }
            this.saving = true;
            setTimeout(() => { this.saveUserData(); this.settings.oldPassword = ''; this.settings.newPassword = ''; this.settings.confirmPassword = ''; this.saving = false; this.profileModalOpen = false; Swal.fire({ icon: 'success', title: 'Berhasil!', text: 'Pengaturan disimpan', timer: 1500, showConfirmButton: false }); }, 800);
        },

        // ══════════════════════════════════════════════
        // LOGOUT & RESET
        // ══════════════════════════════════════════════
        handleLogout() {
            Swal.fire({ title: 'Keluar dari Sistem?', text: 'Anda akan dialihkan ke halaman login', icon: 'question', showCancelButton: true, confirmButtonColor: '#3b82f6', confirmButtonText: 'Ya, Keluar', cancelButtonText: 'Batal' })
                .then(r => {
                    if (r.isConfirmed) {
                        this._destroyAllCharts();
                        this._stopQrScanner();
                        localStorage.removeItem('isLoggedIn');
                        localStorage.removeItem('loggedInUser');
                        localStorage.removeItem('loggedInUsername');
                        localStorage.removeItem('loggedInRole');
                        localStorage.removeItem('loggedInUserId');
                        localStorage.removeItem('loggedInNik');
                        window.location.replace('login.html');
                    }
                });
        },
        confirmResetAll() {
            Swal.fire({ title: 'HAPUS SEMUA DATA?', html: 'Tindakan ini <b>tidak dapat dibatalkan</b>!<br>Ketik <b>deiyai2026</b> untuk konfirmasi', input: 'text', showCancelButton: true, confirmButtonColor: '#ef4444', confirmButtonText: 'Hapus Permanen', preConfirm: kode => { if (kode?.trim() !== 'deiyai2026') { Swal.showValidationMessage('Kode salah'); return false; } return true; } })
                .then(r => { if (r.isConfirmed) { this._destroyAllCharts(); localStorage.clear(); Swal.fire({ title: 'Data dihapus', text: 'Memuat ulang...', icon: 'success', timer: 1500, showConfirmButton: false }).then(() => location.reload(true)); } });
        },

        // ══════════════════════════════════════════════
        // EXPORT & LAPORAN
        // ══════════════════════════════════════════════
        isExporting() { return this.exporting; },
        getExportFormat() { return this.exportFormat; },

        exportPDF() {
            this.exporting = true; this.exportFormat = 'PDF';
            try {
                const { jsPDF } = window.jspdf;
                if (!jsPDF) throw new Error('jsPDF tidak terload');
                const doc = new jsPDF();
                const pw = doc.internal.pageSize.getWidth(), ph = doc.internal.pageSize.getHeight();
                doc.setFontSize(18); doc.setTextColor(37, 99, 235);
                doc.text('Laporan SIMASRA – Asrama Kabupaten Deiyai', pw / 2, 20, { align: 'center' });
                doc.setFontSize(10); doc.setTextColor(100);
                doc.text(`Tanggal: ${new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`, pw / 2, 29, { align: 'center' });
                let y = 42;
                doc.setFontSize(13); doc.setTextColor(0); doc.text('Ringkasan Statistik', 20, y); y += 8;
                doc.autoTable({
                    startY: y, head: [['Kategori', 'Jumlah']],
                    body: [
                        ['Penghuni Aktif', this.penghuniAktif], ['Tingkat Hunian', `${this.hunianPersen}%`],
                        ['Alumni Tahun Ini', this.alumniTahunIni], ['Kamar Kosong (0 penghuni)', this.kamarKosong],
                        ['Slot Tersedia', this.slotTersedia], ['Total Barak', this.totalBarak],
                        ['Total Kamar', this.totalKamarComputed], ['Kapasitas per Kamar', `Maks. ${this.MAX_PENGHUNI_PER_KAMAR} orang`]
                    ],
                    theme: 'grid', headStyles: { fillColor: [37, 99, 235], textColor: 255 }, styles: { fontSize: 10 }, margin: { left: 20, right: 20 }
                });
                y = doc.lastAutoTable.finalY + 15;
                if (this.laporanDistrik.length) {
                    doc.setFontSize(13); doc.text('Penghuni per Distrik', 20, y); y += 8;
                    doc.autoTable({ startY: y, head: [['Distrik', 'Jumlah']], body: this.laporanDistrik.map(d => [d.distrik, d.jumlah]), theme: 'striped', headStyles: { fillColor: [66, 139, 202] }, styles: { fontSize: 10 }, margin: { left: 20, right: 20 } });
                    y = doc.lastAutoTable.finalY + 15;
                }
                if (this.laporanJenjang.length) {
                    doc.setFontSize(13); doc.text('Penghuni per Jenjang', 20, y); y += 8;
                    doc.autoTable({ startY: y, head: [['Jenjang', 'Jumlah']], body: this.laporanJenjang.map(j => [j.jenjang, j.jumlah]), theme: 'striped', headStyles: { fillColor: [66, 139, 202] }, styles: { fontSize: 10 }, margin: { left: 20, right: 20 } });
                }
                const pages = doc.internal.getNumberOfPages();
                for (let i = 1; i <= pages; i++) { doc.setPage(i); doc.setFontSize(9); doc.setTextColor(150); doc.text(`Hal ${i}/${pages} • SIMASRA © ${new Date().getFullYear()}`, pw / 2, ph - 10, { align: 'center' }); }
                doc.save(`laporan_simasra_${new Date().toISOString().split('T')[0]}.pdf`);
            } catch (err) { console.error(err); Swal.fire('Error', 'Gagal membuat PDF. Pastikan koneksi internet aktif.', 'error'); }
            finally { this.exporting = false; this.exportFormat = ''; }
        },

        exportExcel() {
            this.exporting = true; this.exportFormat = 'Excel';
            try {
                if (typeof XLSX === 'undefined') throw new Error('SheetJS tidak terload');
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([
                    ['Kategori', 'Jumlah'], ['Penghuni Aktif', this.penghuniAktif], ['Tingkat Hunian (%)', this.hunianPersen],
                    ['Alumni Tahun Ini', this.alumniTahunIni], ['Kamar Kosong', this.kamarKosong], ['Slot Tersedia', this.slotTersedia],
                    ['Total Barak', this.totalBarak], ['Total Kamar', this.totalKamarComputed], ['Kapasitas per Kamar', `Maks. ${this.MAX_PENGHUNI_PER_KAMAR} orang`]
                ]), 'Ringkasan');
                if (this.penghuni.length) XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([['NIK', 'Nama', 'Jenjang', 'Distrik', 'Tahun Masuk', 'Status', 'Kamar Saat Ini', 'Tanggal Keluar'], ...this.penghuni.map(p => [p.nik, p.nama, p.jenjang, p.distrik, p.tahun_masuk, p.status, this.getKamarSaatIni(p) || '-', p.tanggalKeluar || '-'])]), 'Data Penghuni');
                if (this.laporanDistrik.length) XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([['Distrik', 'Jumlah'], ...this.laporanDistrik.map(d => [d.distrik, d.jumlah])]), 'Per Distrik');
                if (this.inventaris.length) XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([['Barak', 'Kamar', 'Jenis', 'Total', 'Baik', 'Rusak Ringan', 'Rusak Berat', 'Catatan'], ...this.inventaris.map(i => [i.barak, i.nomorKamar || '-', i.jenis, i.jumlahTotal, i.baik, i.rusakRingan, i.rusakBerat, i.catatan || ''])]), 'Inventaris');
                XLSX.writeFile(wb, `laporan_simasra_${new Date().toISOString().split('T')[0]}.xlsx`);
                Swal.fire({ icon: 'success', title: 'Excel Diunduh!', timer: 1500, showConfirmButton: false });
            } catch (err) { console.error(err); Swal.fire('Error', 'Gagal membuat Excel.', 'error'); }
            finally { this.exporting = false; this.exportFormat = ''; }
        },

        backupAllData() {
            const backup = { penghuni: this.penghuni, barak: this.barak, inventaris: this.inventaris, userProfile: this.userProfile, timestamp: new Date().toISOString() };
            const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a'); a.href = url; a.download = `simasra_backup_${new Date().toISOString().split('T')[0]}.json`; a.click(); URL.revokeObjectURL(url);
            Swal.fire({ icon: 'success', title: 'Backup berhasil diunduh!', timer: 1500, showConfirmButton: false });
        },

        generateLaporan() {
            Swal.fire({
                title: `Laporan Tahun ${this.filterTahunLaporan}`,
                html: `<ul class="text-left space-y-2 text-sm">
                    <li>Penghuni Aktif: <strong>${this.penghuniAktif}</strong></li>
                    <li>Alumni Tahun Ini: <strong>${this.alumniTahunIni}</strong></li>
                    <li>Tingkat Hunian: <strong>${this.hunianPersen}%</strong></li>
                    <li>Slot Tersedia: <strong>${this.slotTersedia}</strong></li>
                    <li>Distrik Terbanyak: <strong>${this.laporanDistrik[0]?.distrik || '-'} (${this.laporanDistrik[0]?.jumlah || 0})</strong></li>
                    <li>Total Inventaris: <strong>${this.totalInventaris}</strong></li>
                </ul>`,
                icon: 'info', confirmButtonText: 'Download PDF', showCancelButton: true, cancelButtonText: 'Tutup'
            }).then(r => { if (r.isConfirmed) this.exportPDF(); });
        },

        // ══════════════════════════════════════════════
        // INITIAL DATA
        // ══════════════════════════════════════════════
        resetInitialData() {
            this.penghuni = [
                { nik: '9102017501010001', nama: 'Yohanis Duwiri', nisn_nim: '123456789012', distrik: 'Tigi', jenjang: 'SMA', tahun_masuk: 2023, status: 'aktif', jenis_kelamin: 'Laki-laki', no_hp: '0812xxxxxxx', kamarSaatIni: null, tanggalKeluar: null },
                { nik: '9102026805020002', nama: 'Maria Kogoya', nisn_nim: '987654321098', distrik: 'Deiyai', jenjang: 'Mahasiswa', tahun_masuk: 2022, status: 'aktif', jenis_kelamin: 'Perempuan', no_hp: '0821xxxxxxx', kamarSaatIni: null, tanggalKeluar: null },
                { nik: '9102035508030003', nama: 'Daniel Wonda', nisn_nim: '', distrik: 'Tigi Barat', jenjang: 'SMA', tahun_masuk: 2021, status: 'alumni', jenis_kelamin: 'Laki-laki', no_hp: '', kamarSaatIni: null, tanggalKeluar: '2024-06-15' },
                { nik: '9102044409040004', nama: 'Siska Tabuni', nisn_nim: '1122334455', distrik: 'Paniai', jenjang: 'Mahasiswa', tahun_masuk: 2024, status: 'aktif', jenis_kelamin: 'Perempuan', no_hp: '0852xxxxxxx', kamarSaatIni: null, tanggalKeluar: null },
                { nik: '9102055210050005', nama: 'Oktovianus Mote', nisn_nim: '', distrik: 'Tigi Timur', jenjang: 'SMA', tahun_masuk: 2024, status: 'aktif', jenis_kelamin: 'Laki-laki', no_hp: '', kamarSaatIni: null, tanggalKeluar: null },
            ];

            const buatDaftarKamar = (lantai, mulai, jumlah) =>
                Array.from({ length: jumlah }, (_, i) => ({
                    nomor: `${lantai}${String(mulai + i).padStart(2, '0')}`,
                    status: 'kosong',
                    penghuniList: [],   // array NIK, maks MAX_PENGHUNI_PER_KAMAR
                    tanggalMasuk: null,
                    riwayat: []
                }));

            this.barak = [
                { id: 1, lantai: 1, sisi: 'Barak Kiri', kapasitas: 7, terisi: 0, status: 'kosong', rentangKamar: '101–107', daftarKamar: buatDaftarKamar(1, 1, 7) },
                { id: 2, lantai: 1, sisi: 'Barak Kanan', kapasitas: 7, terisi: 0, status: 'kosong', rentangKamar: '108–114', daftarKamar: buatDaftarKamar(1, 8, 7) },
                { id: 3, lantai: 2, sisi: 'Barak Kiri', kapasitas: 7, terisi: 0, status: 'kosong', rentangKamar: '201–207', daftarKamar: buatDaftarKamar(2, 1, 7) },
                { id: 4, lantai: 2, sisi: 'Barak Kanan', kapasitas: 7, terisi: 0, status: 'kosong', rentangKamar: '208–214', daftarKamar: buatDaftarKamar(2, 8, 7) },
                { id: 5, lantai: 3, sisi: 'Barak Kiri', kapasitas: 7, terisi: 0, status: 'kosong', rentangKamar: '301–307', daftarKamar: buatDaftarKamar(3, 1, 7) },
                { id: 6, lantai: 3, sisi: 'Barak Kanan', kapasitas: 7, terisi: 0, status: 'kosong', rentangKamar: '308–314', daftarKamar: buatDaftarKamar(3, 8, 7) },
            ];

            this.inventaris = [];
            this.saveToStorage();
        }

    }));
});