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
        currentRole: sessionStorage.getItem('loggedInRole') || 'penghuni',
        currentUsername: sessionStorage.getItem('loggedInUsername') || sessionStorage.getItem('loggedInUser') || '',
        currentUserId: sessionStorage.getItem('loggedInUserId') || '',
        currentNik: sessionStorage.getItem('loggedInNik') || '',

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
        scannerFacingMode: 'environment', // 'environment' (kamera belakang) | 'user' (kamera depan)
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

        // Modal & filter — MANAJEMEN PENGGUNA
        userModalOpen: false,
        isEditUser: false,
        userForm: {},
        searchUserQuery: '',
        filterRoleUser: '',
        currentPageUser: 1,
        itemsPerPageUser: 8,

        // Instance scanner QR aktif (internal)
        _qrScannerInstance: null,

        // ══════════════════════════════════════════════
        // DATA UTAMA
        // ══════════════════════════════════════════════
        penghuni: [],
        barak: [],
        inventaris: [],

        userProfile: {
            name: '',
            email: '',
            phone: '',
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
        // GETTERS & HELPER — ROLE / AKSES / PROFIL
        // ══════════════════════════════════════════════
        hasAccess(page) {
            return (this.ROLE_ACCESS[this.currentRole] || []).includes(page);
        },
        isAdmin() { return this.currentRole === 'admin'; },
        isPembina() { return this.currentRole === 'pembina'; },
        isPimpinan() { return this.currentRole === 'pimpinan'; },
        isPenghuni() { return this.currentRole === 'penghuni'; },
        isAdminOrPembina() { return this.currentRole === 'admin' || this.currentRole === 'pembina'; },

        get myPenghuni() {
            const targetNik = this.currentNik || this._currentUserRecord()?.nik;
            if (!targetNik) return null;
            return this.penghuni.find(p => p.nik === targetNik) || null;
        },

        get currentDisplayName() {
            // Prioritas 1: Jika role penghuni, selalu sinkron dengan nama di master data penghuni
            if (this.currentRole === 'penghuni') {
                if (this.myPenghuni && this.myPenghuni.nama) return this.myPenghuni.nama;
                const akun = this._currentUserRecord();
                if (akun && akun.nama) return akun.nama;
            }
            // Prioritas 2: Nama dari userProfile jika ada
            if (this.userProfile && this.userProfile.name && this.userProfile.name.trim()) {
                return this.userProfile.name.trim();
            }
            // Prioritas 3: Akun pengguna dari tabel users
            const akun = this._currentUserRecord();
            if (akun && akun.nama) return akun.nama;
            return this.ROLE_LABEL[this.currentRole] || 'Pengguna';
        },

        get currentUserInitial() {
            const name = this.currentDisplayName;
            return name ? name.charAt(0).toUpperCase() : (this.ROLE_LABEL[this.currentRole] ? this.ROLE_LABEL[this.currentRole].charAt(0).toUpperCase() : 'U');
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

        // Set NIK penghuni yang izinnya aktif HARI INI:
        // status=disetujui DAN tanggalKeluar <= hari ini DAN estimasiKembali >= hari ini
        get izinHariIniNiks() {
            const today = new Date().toISOString().slice(0, 10);
            const niks = new Set();
            this.izin.forEach(i => {
                if (i.status !== 'disetujui') return;
                const tgl = (i.tanggalKeluar || '').slice(0, 10);
                const est = (i.estimasiKembali || '').slice(0, 10);
                if (tgl <= today && est >= today) niks.add(i.nik);
            });
            return niks;
        },

        // Jumlah penghuni yang sedang izin aktif hari ini
        get izinHariIniCount() {
            return this.izinHariIniNiks.size;
        },

        // Tidak hadir = penghuni aktif yang tidak presensi DAN tidak sedang izin hari ini
        get tidakHadirHariIni() {
            const hadirNiks = new Set(this.presensiHariIni.map(r => r.nik));
            const izinNiks = this.izinHariIniNiks;
            return this.penghuniAktifList.filter(p => !hadirNiks.has(p.nik) && !izinNiks.has(p.nik)).length;
        },

        // Persentase kehadiran = hadir / (aktif - sedang izin hari ini) × 100
        // Jika semua penghuni sedang izin → 0 (bukan NaN)
        get persenKehadiranHariIni() {
            const total = this.penghuniAktifList.length;
            const izin = this.izinHariIniNiks.size;
            const efektif = total - izin;
            if (efektif <= 0) return total > 0 ? 100 : 0;
            return Math.round((this.hadirHariIni / efektif) * 100);
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
        get totalUserAdmin() { return this.users.filter(u => u.role === 'admin').length; },
        get totalUserPembina() { return this.users.filter(u => u.role === 'pembina').length; },
        get totalUserPenghuni() { return this.users.filter(u => u.role === 'penghuni').length; },
        get totalUserPimpinan() { return this.users.filter(u => u.role === 'pimpinan').length; },
        get filteredUsersAll() {
            let r = [...this.users];
            if (this.filterRoleUser) r = r.filter(u => u.role === this.filterRoleUser);
            const q = (this.searchUserQuery || '').toLowerCase().trim();
            if (q) {
                r = r.filter(u =>
                    (u.nama || '').toLowerCase().includes(q) ||
                    (u.username || '').toLowerCase().includes(q) ||
                    (u.nik || '').includes(q) ||
                    (this.ROLE_LABEL[u.role] || '').toLowerCase().includes(q)
                );
            }
            return r;
        },
        get filteredUsers() {
            const all = this.filteredUsersAll;
            const s = (this.currentPageUser - 1) * this.itemsPerPageUser;
            return all.slice(s, s + this.itemsPerPageUser);
        },

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

        // ══════════════════════════════════════════════
        // PROFIL PENGGUNA — per akun (bukan blob global)
        // Setiap username punya kunci penyimpanan sendiri agar saat berpindah
        // akun/role (logout-login atau login di tab lain), foto/nama/email yang
        // tampil di toggle profile SELALU milik akun yang sedang login, bukan
        // sisa akun sebelumnya.
        // ══════════════════════════════════════════════
        _getUsersRaw() {
            try {
                const raw = localStorage.getItem(this.STORAGE_KEYS.USERS);
                const arr = raw ? JSON.parse(raw) : null;
                return Array.isArray(arr) && arr.length ? arr : this._seedDefaultUsers();
            } catch { return this._seedDefaultUsers(); }
        },

        // Cari data akun yang sedang login. Pakai this.users kalau sudah dimuat,
        // kalau belum (dipanggil sebelum loadExtraData) baca langsung dari localStorage.
        _currentUserRecord() {
            const list = (this.users && this.users.length) ? this.users : this._getUsersRaw();
            return list.find(u => String(u.id) === String(this.currentUserId))
                || list.find(u => (u.username || '').toLowerCase() === (this.currentUsername || '').toLowerCase())
                || null;
        },

        _profileStorageKey() {
            const uname = (this.currentUsername || 'guest').toLowerCase();
            return `${this.STORAGE_KEYS.USER_PROFILE}::${uname}`;
        },

        _settingsStorageKey() {
            const uname = (this.currentUsername || 'guest').toLowerCase();
            return `${this.STORAGE_KEYS.USER_SETTINGS}::${uname}`;
        },

        // Profil bawaan diambil dari data akun login & master penghuni,
        // BUKAN nama hardcode, supaya konsisten dengan role yang sedang aktif.
        _defaultProfileForCurrentUser() {
            let nama = '';
            let phone = '';
            if (this.currentRole === 'penghuni' && this.myPenghuni) {
                nama = this.myPenghuni.nama || '';
                phone = this.myPenghuni.no_hp || '';
            } else {
                const u = this._currentUserRecord();
                nama = u?.nama || this.ROLE_LABEL[this.currentRole] || 'Pengguna';
            }
            const emailSlug = (this.currentUsername || 'user').toLowerCase().replace(/[^a-z0-9]/g, '');
            return { name: nama, email: `${emailSlug}@simasra.local`, phone: phone, photo: '' };
        },

        loadUserData() {
            try {
                const base = this._defaultProfileForCurrentUser();
                const p = localStorage.getItem(this._profileStorageKey());
                let parsed = p ? JSON.parse(p) : {};

                // Pastikan jika role penghuni, nama di profile selalu sinkron dengan data penghuni
                if (this.currentRole === 'penghuni' && this.myPenghuni && this.myPenghuni.nama) {
                    parsed.name = this.myPenghuni.nama;
                    if (this.myPenghuni.no_hp) parsed.phone = this.myPenghuni.no_hp;
                } else if (!parsed.name) {
                    parsed.name = base.name;
                }

                this.userProfile = { ...base, ...parsed };

                const defaultSettings = { oldPassword: '', newPassword: '', confirmPassword: '', emailNotifications: true };
                const s = localStorage.getItem(this._settingsStorageKey());
                this.settings = s ? { ...defaultSettings, ...JSON.parse(s), oldPassword: '', newPassword: '', confirmPassword: '' } : defaultSettings;
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
                localStorage.setItem(this._profileStorageKey(), JSON.stringify(this.userProfile));
                // Jangan pernah menyimpan password mentah ke storage pengaturan tampilan
                const { oldPassword, newPassword, confirmPassword, ...persistedSettings } = this.settings;
                localStorage.setItem(this._settingsStorageKey(), JSON.stringify(persistedSettings));
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
        // SINKRONISASI REAL-TIME ANTAR TAB/JENDELA
        // Menangani perubahan yang terjadi di login.html (registrasi mandiri,
        // lupa sandi) atau di jendela/tab index.html lain, agar dashboard admin
        // yang sedang terbuka langsung ter-update tanpa perlu memuat ulang.
        // Catatan: event 'storage' hanya terpicu di tab LAIN dari yang menulis
        // data, dan hanya berlaku dalam satu browser/perangkat yang sama
        // (localStorage tidak tersinkronisasi lintas perangkat tanpa backend).
        // ══════════════════════════════════════════════
        _setupLiveSync() {
            window.addEventListener('storage', (e) => {
                if (!e.key) return;
                const parseArr = (v) => {
                    try { const p = JSON.parse(v || '[]'); return Array.isArray(p) ? p : null; }
                    catch { return null; }
                };

                if (e.key === this.STORAGE_KEYS.USERS) {
                    const jumlahSebelumnya = this.users.length;
                    const fresh = parseArr(e.newValue);
                    if (fresh) this.users = fresh;

                    // Notifikasi visual instan untuk admin/pembina saat ada pendaftar baru
                    if (fresh && fresh.length > jumlahSebelumnya && this.currentRole !== 'penghuni' && typeof Swal !== 'undefined') {
                        Swal.mixin({
                            toast: true,
                            position: 'top-end',
                            showConfirmButton: false,
                            timer: 4000,
                            timerProgressBar: true
                        }).fire({ icon: 'info', title: 'Ada pendaftaran akun baru dari halaman Login' });
                    }
                }

                if (e.key === this.STORAGE_KEYS.NOTIFIKASI) {
                    const fresh = parseArr(e.newValue);
                    if (fresh) this.notifikasi = fresh;
                }

                if (e.key === this.STORAGE_KEYS.PENGHUNI) {
                    const fresh = parseArr(e.newValue);
                    if (fresh) this.penghuni = fresh;
                }
            });
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
            else if (n.tipe === 'akun') this.setPage('pengguna');
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

        // Dipanggil setiap kali kamera berhasil membaca kode QR.
        // 1) Mencatat presensi (check-in / check-out otomatis tergantung data hari ini)
        // 2) Menampilkan alert SweetAlert yang jelas (berhasil/gagal) — bukan hanya teks kecil
        // 3) Menjeda (pause) kamera selama alert tampil, lalu melanjutkan (resume) otomatis,
        //    supaya kode QR yang sama tidak langsung terbaca ulang pada frame berikutnya
        //    dan penghuni tetap punya kesempatan memindai QR lagi nanti untuk jam pulang (checkout).
        _handleQrScanResult(nik) {
            const r = this._catatPresensi(nik, 'qr');
            this.scanFeedback = { type: r.ok ? 'success' : 'error', text: r.msg };

            // Jeda kamera sejenak agar tidak langsung memindai ulang kode yang sama
            if (this._qrScannerInstance) {
                try { this._qrScannerInstance.pause(true); } catch (e) { /* abaikan */ }
            }

            const judul = r.ok
                ? (r.type === 'checkin' ? 'Presensi Masuk Berhasil' : 'Presensi Keluar Berhasil')
                : 'Presensi Gagal';

            Swal.fire({
                icon: r.ok ? 'success' : 'warning',
                title: judul,
                text: r.msg,
                timer: 2200,
                showConfirmButton: false
            }).then(() => {
                // Lanjutkan pemindaian setelah alert tertutup, siap untuk scan berikutnya
                // (mis. scan penghuni lain, atau scan penghuni yang sama nanti saat jam pulang)
                if (this._qrScannerInstance) {
                    try { this._qrScannerInstance.resume(); } catch (e) { /* abaikan */ }
                }
            });
        },

        _startQrScanner(elementId, onSuccess) {
            if (typeof Html5Qrcode === 'undefined') {
                this.scanFeedback = { type: 'error', text: 'Pustaka pemindai QR gagal dimuat.' };
                return;
            }
            this._stopQrScanner().then(() => {
                const scanner = new Html5Qrcode(elementId);
                this._qrScannerInstance = scanner;
                const facing = this.scannerFacingMode || 'environment';
                scanner.start(
                    { facingMode: facing },
                    { fps: 10, qrbox: { width: 220, height: 220 } },
                    (decodedText) => onSuccess(decodedText),
                    () => { /* abaikan error per-frame */ }
                ).catch((err) => {
                    console.warn('Scanner start error:', err);
                    this.scanFeedback = {
                        type: 'error',
                        text: `Tidak dapat mengakses ${facing === 'user' ? 'kamera depan' : 'kamera belakang'}. Periksa izin kamera di browser Anda.`
                    };
                });
            });
        },

        _stopQrScanner() {
            return new Promise((resolve) => {
                if (this._qrScannerInstance) {
                    try {
                        this._qrScannerInstance.stop().then(() => {
                            try { this._qrScannerInstance.clear(); } catch (e) { /* abaikan */ }
                            this._qrScannerInstance = null;
                            resolve();
                        }).catch(() => {
                            try { this._qrScannerInstance.clear(); } catch (e) { /* abaikan */ }
                            this._qrScannerInstance = null;
                            resolve();
                        });
                    } catch (e) {
                        this._qrScannerInstance = null;
                        resolve();
                    }
                } else {
                    resolve();
                }
            });
        },

        switchCamera(targetElementId = null) {
            this.scannerFacingMode = (this.scannerFacingMode === 'environment') ? 'user' : 'environment';
            const elId = targetElementId || (this.scannerOpen ? 'qr-reader' : 'qr-reader-dashboard');
            this.scanFeedback = {
                type: 'info',
                text: `Beralih ke ${this.scannerFacingMode === 'user' ? 'Kamera Depan' : 'Kamera Belakang'}...`
            };
            this._startQrScanner(elId, (nik) => {
                this._handleQrScanResult(nik);
            });
        },

        openScanner() {
            this.scannerOpen = true;
            this.scanFeedback = null;
            this.$nextTick(() => {
                this._startQrScanner('qr-reader', (nik) => {
                    this._handleQrScanResult(nik);
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
                        this._handleQrScanResult(nik);
                    });
                });
            } else {
                this._stopQrScanner();
            }
        },


        // ══════════════════════════════════════════════
        // KARTU ANGGOTA (QR & IDENTITAS RESMI)
        // ══════════════════════════════════════════════
        _renderQR(elId, text) {
            const el = document.getElementById(elId);
            if (!el || typeof QRCode === 'undefined') return;
            el.innerHTML = '';
            new QRCode(el, { text: text || '-', width: 140, height: 140, colorDark: '#0f172a', colorLight: '#ffffff' });
        },

        _getQrDataUrl(text, size = 240) {
            return new Promise((resolve) => {
                if (typeof QRCode === 'undefined') { resolve(''); return; }
                const tempDiv = document.createElement('div');
                tempDiv.style.cssText = 'position:fixed;left:-9999px;top:-9999px;opacity:0;';
                document.body.appendChild(tempDiv);
                try {
                    new QRCode(tempDiv, {
                        text: text || '-',
                        width: size,
                        height: size,
                        colorDark: '#0f172a',
                        colorLight: '#ffffff'
                    });
                    setTimeout(() => {
                        const img = tempDiv.querySelector('img');
                        const canvas = tempDiv.querySelector('canvas');
                        let src = '';
                        if (img && img.src && img.src.startsWith('data:')) {
                            src = img.src;
                        } else if (canvas) {
                            src = canvas.toDataURL('image/png');
                        }
                        tempDiv.remove();
                        resolve(src);
                    }, 80);
                } catch (err) {
                    tempDiv.remove();
                    resolve('');
                }
            });
        },

        get kartuPhoto() {
            if (!this.kartuPenghuni) return '';
            // Jika kartu yang dibuka adalah akun yang sedang login, gunakan foto profil aktif
            if (this.kartuPenghuni.nik === this.currentNik && this.userProfile?.photo) {
                return this.userProfile.photo;
            }
            return this.kartuPenghuni.photo || '';
        },

        openKartuAnggota(p) {
            let target = p;
            if (!target) {
                target = this.myPenghuni;
                if (!target && this.currentNik) {
                    target = this.penghuni.find(x => x.nik === this.currentNik);
                }
                if (!target) {
                    const u = this._currentUserRecord();
                    if (u && u.nik) target = this.penghuni.find(x => x.nik === u.nik);
                }
            }
            if (!target) {
                Swal.fire('Info', 'Data penghuni belum terhubung dengan akun ini. Silakan hubungi admin.', 'info');
                return;
            }
            // Selalu ambil versi paling mutakhir dari master data
            const latest = this.penghuni.find(x => x.nik === target.nik) || target;
            this.kartuPenghuni = { ...latest };
            this.kartuModalOpen = true;
            this.$nextTick(() => this._renderQR('qr-kartu-anggota', latest.nik));
        },

        async downloadKartu(canvasId, nik) {
            const targetNik = nik || (this.kartuPenghuni ? this.kartuPenghuni.nik : this.currentNik);
            const p = (targetNik ? this.penghuni.find(x => x.nik === targetNik) : null) || this.kartuPenghuni || this.myPenghuni;
            const nama = p?.nama || this.currentDisplayName || 'Penghuni Asrama';
            const nikText = targetNik || p?.nik || '-';
            const distrik = p?.distrik ? `${p.distrik} · ${p.jenjang || 'Penghuni'}` : 'Asrama Kabupaten Deiyai';
            const kamar = this.getKamarSaatIni(p) || 'Asrama Deiyai Jayapura';

            // 1. Dapatkan Data URL QR Code
            let qrSrc = await this._getQrDataUrl(nikText, 240);
            if (!qrSrc) {
                const elId = canvasId || 'qr-kartu-anggota';
                const el = document.getElementById(elId);
                const img = el ? el.querySelector('img') : null;
                const canvas = el ? el.querySelector('canvas') : null;
                qrSrc = img ? img.src : (canvas ? canvas.toDataURL('image/png') : null);
            }

            if (!qrSrc) {
                Swal.fire('Gagal', 'QR Code sedang disiapkan, silakan coba beberapa saat lagi.', 'warning');
                return;
            }

            // 2. Buat Canvas ID Card Resmi Resolusi Tinggi (500 x 680 px)
            const c = document.createElement('canvas');
            c.width = 500;
            c.height = 680;
            const ctx = c.getContext('2d');

            // Background
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, 500, 680);

            // Header Gradient Biru-Indigo
            const grad = ctx.createLinearGradient(0, 0, 500, 0);
            grad.addColorStop(0, '#2563eb');
            grad.addColorStop(0.5, '#4f46e5');
            grad.addColorStop(1, '#7c3aed');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, 500, 140);

            // Header Teks
            ctx.fillStyle = '#bfdbfe';
            ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('PEMERINTAH KABUPATEN DEIYAI', 250, 32);

            ctx.fillStyle = '#ffffff';
            ctx.font = '800 18px "Plus Jakarta Sans", sans-serif';
            ctx.fillText('ASRAMA KABUPATEN DEIYAI', 250, 60);

            ctx.fillStyle = '#e0e7ff';
            ctx.font = '500 12px "DM Sans", sans-serif';
            ctx.fillText('Kota Studi Jayapura · Papua', 250, 82);

            // Pill Badge
            ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
            ctx.beginPath();
            if (ctx.roundRect) {
                ctx.roundRect(150, 96, 200, 24, 12);
            } else {
                ctx.rect(150, 96, 200, 24);
            }
            ctx.fill();
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
            ctx.fillText('KARTU PRESENSI RESMI', 250, 112);

            // Nama & NIK
            ctx.fillStyle = '#0f172a';
            ctx.font = '800 20px "Plus Jakarta Sans", sans-serif';
            ctx.fillText(nama, 250, 178);

            ctx.fillStyle = '#64748b';
            ctx.font = '600 13px monospace';
            ctx.fillText(`NIK: ${nikText}`, 250, 202);

            // Info Box
            ctx.fillStyle = '#f8fafc';
            ctx.strokeStyle = '#e2e8f0';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            if (ctx.roundRect) {
                ctx.roundRect(40, 218, 420, 56, 10);
            } else {
                ctx.rect(40, 218, 420, 56);
            }
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#475569';
            ctx.font = '600 12px "DM Sans", sans-serif';
            ctx.fillText(distrik, 250, 240);
            ctx.fillStyle = '#2563eb';
            ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
            ctx.fillText(`Kamar: ${kamar}`, 250, 260);

            // 3. Gambar QR Code
            const qrImg = new Image();
            qrImg.crossOrigin = 'anonymous';
            qrImg.onload = () => {
                // Background QR
                ctx.fillStyle = '#ffffff';
                ctx.strokeStyle = '#cbd5e1';
                ctx.lineWidth = 2;
                ctx.beginPath();
                if (ctx.roundRect) {
                    ctx.roundRect(140, 292, 220, 220, 16);
                } else {
                    ctx.rect(140, 292, 220, 220);
                }
                ctx.fill();
                ctx.stroke();

                ctx.drawImage(qrImg, 150, 302, 200, 200);

                // Petunjuk
                ctx.fillStyle = '#64748b';
                ctx.font = '500 12px "DM Sans", sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('Tunjukkan QR ini di gerbang asrama untuk presensi', 250, 542);

                // Footer
                ctx.fillStyle = '#f1f5f9';
                ctx.fillRect(0, 580, 500, 100);
                ctx.strokeStyle = '#e2e8f0';
                ctx.beginPath();
                ctx.moveTo(0, 580);
                ctx.lineTo(500, 580);
                ctx.stroke();

                // Status Dot & Teks
                ctx.fillStyle = '#22c55e';
                ctx.beginPath();
                ctx.arc(60, 630, 5, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = '#166534';
                ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
                ctx.textAlign = 'left';
                ctx.fillText('Status: Penghuni Aktif', 72, 634);

                ctx.fillStyle = '#94a3b8';
                ctx.font = '500 11px "DM Sans", sans-serif';
                ctx.textAlign = 'right';
                ctx.fillText('SIMASRA · Deiyai 2026', 450, 634);

                // Unduh File
                const cleanName = nama.replace(/[^a-zA-Z0-9_-]/g, '_');
                const downloadUrl = c.toDataURL('image/png');
                const a = document.createElement('a');
                a.href = downloadUrl;
                a.download = `KTA_QR_${nikText}_${cleanName}.png`;
                document.body.appendChild(a);
                a.click();
                a.remove();

                Swal.fire({
                    icon: 'success',
                    title: 'Kartu QR Berhasil Diunduh!',
                    text: `File KTA_QR_${nikText}_${cleanName}.png telah tersimpan`,
                    timer: 1800,
                    showConfirmButton: false
                });
            };
            qrImg.src = qrSrc;
        },


        async printKartu() {
            const el = document.getElementById('kta-card-print');
            if (!el) { window.print(); return; }

            const targetNik = this.kartuPenghuni ? this.kartuPenghuni.nik : this.currentNik;
            const p = (targetNik ? this.penghuni.find(x => x.nik === targetNik) : null) || this.kartuPenghuni || this.myPenghuni;
            const nama = p?.nama || this.currentDisplayName || 'Penghuni';

            // 1. Dapatkan Data URL QR Code secara pasti
            let qrSrc = await this._getQrDataUrl(targetNik, 200);
            if (!qrSrc) {
                const qrEl = document.getElementById('qr-kartu-anggota');
                const img = qrEl ? qrEl.querySelector('img') : null;
                const canvas = qrEl ? qrEl.querySelector('canvas') : null;
                qrSrc = (img && img.src && img.src.startsWith('data:')) ? img.src : (canvas ? canvas.toDataURL('image/png') : '');
            }

            // 2. Clone elemen KTA dan gantikan container canvas dengan elemen img mandiri
            const clone = el.cloneNode(true);
            const qrContainer = clone.querySelector('#qr-kartu-anggota');
            if (qrContainer && qrSrc) {
                qrContainer.innerHTML = `<img src="${qrSrc}" alt="QR Code Presensi" style="width:140px;height:140px;display:block;margin:0 auto;border-radius:8px;" />`;
            }

            // 3. Buka jendela print baru
            const printWindow = window.open('', '_blank', 'width=750,height=950');
            if (!printWindow) {
                Swal.fire('Info', 'Jendela cetak diblokir oleh browser. Silakan izinkan pop-up pada browser Anda.', 'info');
                return;
            }

            printWindow.document.open();
            printWindow.document.write(`
                <!DOCTYPE html>
                <html lang="id">
                <head>
                    <meta charset="UTF-8">
                    <title>KTA - ${nama}</title>
                    <script src="https://cdn.tailwindcss.com"></script>
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
                    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet">
                    <style>
                        * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; color-adjust: exact !important; }
                        body { font-family: 'DM Sans', sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
                        @media print {
                            body { background: transparent !important; padding: 0 !important; min-height: auto !important; }
                            .no-print { display: none !important; }
                            .print-card { box-shadow: none !important; border: 1px solid #cbd5e1 !important; page-break-inside: avoid; margin: 0 auto; }
                        }
                    </style>
                </head>
                <body>
                    <div class="print-card w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
                        ${clone.innerHTML}
                    </div>
                </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.focus();

            setTimeout(() => {
                printWindow.print();
            }, 600);
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
            // Ambil nama terbaru jika akun penghuni terhubung ke data master penghuni
            let namaTerkini = u.nama;
            if (u.role === 'penghuni' && u.nik) {
                const p = this.penghuni.find(x => x.nik === u.nik);
                if (p && p.nama) namaTerkini = p.nama;
            }
            this.userForm = { ...u, nama: namaTerkini, nik: u.nik || '' };
            this.userModalOpen = true;
        },

        onUserRoleChange() {
            if (this.userForm.role !== 'penghuni') {
                this.userForm.nik = '';
            } else {
                if (this.userForm.nik) {
                    this.onUserPenghuniSelect();
                }
            }
        },

        onUserPenghuniSelect() {
            if (this.userForm.role === 'penghuni' && this.userForm.nik) {
                const p = this.penghuni.find(x => x.nik === this.userForm.nik);
                if (p) {
                    // Otomatis sinkronkan field Nama Lengkap dengan nama penghuni yang dipilih
                    this.userForm.nama = p.nama;
                    // Jika username masih kosong, usulkan username default
                    if (!this.userForm.username && !this.isEditUser) {
                        const cleanName = (p.nama || '').toLowerCase().replace(/[^a-z0-9]/g, '');
                        this.userForm.username = cleanName || ('penghuni_' + p.nik.slice(-4));
                    }
                }
            }
        },

        simpanUser() {
            if (!this.userForm.username?.trim() || !this.userForm.password?.trim() || !this.userForm.nama?.trim()) {
                Swal.fire('Lengkapi Data', 'Username, kata sandi, dan nama lengkap wajib diisi.', 'warning');
                return;
            }
            if (this.userForm.role === 'penghuni' && !this.userForm.nik) {
                Swal.fire('Pilih Penghuni', 'Untuk role Penghuni, silakan pilih keterkaitan Data Penghuni.', 'warning');
                return;
            }
            const uname = this.userForm.username.trim();
            const unameLower = uname.toLowerCase();
            const dup = this.users.find(u => u.username.toLowerCase() === unameLower && u.id !== this.userForm.id);
            if (dup) {
                Swal.fire('Gagal', 'Username sudah digunakan oleh akun lain.', 'error');
                return;
            }

            const userData = {
                ...this.userForm,
                username: uname,
                nama: this.userForm.nama.trim(),
                password: this.userForm.password.trim(),
                nik: this.userForm.role === 'penghuni' ? (this.userForm.nik || '') : null
            };

            const isCurrentLoggedIn = (this.isEditUser && (
                String(this.userForm.id) === String(this.currentUserId) ||
                (this.userForm.username || '').toLowerCase() === (this.currentUsername || '').toLowerCase()
            ));

            if (this.isEditUser) {
                const idx = this.users.findIndex(x => x.id === this.userForm.id);
                if (idx !== -1) this.users[idx] = { ...this.users[idx], ...userData };
            } else {
                const newUser = { id: Date.now(), ...userData };
                this.users.push(newUser);
            }

            // SINKRONISASI KE MASTER DATA PENGHUNI:
            // Jika akun penghuni dan ada NIK, sinkronkan nama di master data penghuni!
            if (userData.role === 'penghuni' && userData.nik) {
                const pIdx = this.penghuni.findIndex(p => p.nik === userData.nik);
                if (pIdx !== -1) {
                    this.penghuni[pIdx].nama = userData.nama;
                    this.saveToStorage();
                }
            }

            // SINKRONISASI KE AKUN YANG SEDANG LOGIN SAAT INI:
            if (isCurrentLoggedIn) {
                this.userProfile.name = userData.nama;
                this.currentUsername = userData.username;
                this.currentRole = userData.role;
                this.currentNik = userData.nik || '';

                sessionStorage.setItem('loggedInUsername', userData.username);
                sessionStorage.setItem('loggedInUser', userData.username);
                sessionStorage.setItem('loggedInRole', userData.role);
                sessionStorage.setItem('loggedInNik', userData.nik || '');

                this.saveUserData();
            }

            this.saveExtraData();
            this.userModalOpen = false;

            Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: this.isEditUser ? 'Data akun berhasil diperbarui dan disinkronkan' : 'Akun baru berhasil ditambahkan dan disinkronkan',
                timer: 1600,
                showConfirmButton: false
            });
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
            // Gunakan offsetParent (O(1)) yang sangat cepat tanpa layout reflow berulang
            return canvas.offsetParent !== null && canvas.clientWidth > 0 && canvas.clientHeight > 0;
        },

        // ══════════════════════════════════════════════
        // INIT
        // ══════════════════════════════════════════════
        init() {
            const isLoggedIn = sessionStorage.getItem('isLoggedIn');
            if (!isLoggedIn || isLoggedIn !== 'true') {
                // Belum login → arahkan dulu ke landing page (bukan langsung ke form login)
                window.location.replace('landing.html');
                return;
            }
            this.loadFromStorage();
            this.loadExtraData();   // muat this.users dulu, agar profil default sesuai akun login
            this.loadUserData();
            this.updateDarkMode();
            this._setupLiveSync();

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
            this.$watch('presensi', () => {
                this.saveExtraData();
                // Update grafik kehadiran mingguan real-time saat ada presensi baru
                if (this.currentPage === 'dashboard' && this.currentRole !== 'penghuni')
                    this._scheduleChartRender(150);
            });
            this.$watch('izin', () => this.saveExtraData());
            this.$watch('pelanggaran', () => this.saveExtraData());
            this.$watch('aktivitas', () => this.saveExtraData());
            this.$watch('users', () => this.saveExtraData());
            this.$watch('notifikasi', () => this.saveExtraData());
            this.$watch('darkMode', () => {
                this.updateDarkMode(); this.saveUserData();
                if (this.currentPage === 'dashboard' || this.currentPage === 'laporan')
                    this._scheduleChartRender(100);
            });
            this.$watch('currentPage', () => {
                this._destroyAllCharts();
                this._stopQrScanner();
                this.dashboardScannerActive = false;
                if (this.currentPage === 'dashboard' || this.currentPage === 'laporan')
                    this._scheduleChartRender(150);
                if (this.currentPage === 'dashboard' && this.currentRole === 'penghuni' && this.currentNik) {
                    this.$nextTick(() => this._renderQR('qr-dashboard-penghuni', this.currentNik));
                }
            });

            this._scheduleChartRender(300);

            this.$nextTick(() => {
                if (this.currentPage === 'dashboard' && this.currentRole === 'penghuni' && this.currentNik) {
                    this._renderQR('qr-dashboard-penghuni', this.currentNik);
                }
                const loader = document.getElementById('page-loader');
                if (loader) {
                    setTimeout(() => {
                        loader.style.opacity = '0';
                        setTimeout(() => { try { loader.remove(); } catch (e) { } }, 400);
                    }, 350);
                }
            });
        },

        _chartRenderTimer: null,

        _scheduleChartRender(delay = 150) {
            if (this._chartRenderTimer) clearTimeout(this._chartRenderTimer);
            this._chartRenderTimer = setTimeout(() => {
                this._chartRenderTimer = null;
                requestAnimationFrame(() => {
                    this.renderAllCharts();
                });
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

        renderBarChart(canvasId, labels, data, color, label = '') {
            if (!this._isCanvasReady(canvasId)) return;
            const canvas = document.getElementById(canvasId);
            this._destroyChart(canvasId);
            const isDark = this.darkMode;
            const textColor = isDark ? '#94a3b8' : '#64748b';
            const gridColor = isDark ? '#1e293b' : '#f1f5f9';
            try {
                const chart = new Chart(canvas, {
                    type: 'bar',
                    data: {
                        labels,
                        datasets: [{
                            label: label || 'Hadir',
                            data,
                            backgroundColor: color + 'CC',
                            borderColor: color,
                            borderWidth: 2,
                            borderRadius: 8,
                            borderSkipped: false,
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { display: false },
                            tooltip: {
                                callbacks: {
                                    label: ctx => ` ${ctx.parsed.y} penghuni hadir`
                                }
                            }
                        },
                        scales: {
                            x: {
                                grid: { color: gridColor },
                                ticks: { color: textColor, font: { size: 12, family: "'DM Sans', sans-serif" } }
                            },
                            y: {
                                beginAtZero: true,
                                grid: { color: gridColor },
                                ticks: {
                                    color: textColor,
                                    font: { size: 12, family: "'DM Sans', sans-serif" },
                                    stepSize: 1,
                                    precision: 0
                                }
                            }
                        },
                        animation: { duration: 600, easing: 'easeInOutQuart' }
                    }
                });
                this.chartInstances[canvasId] = chart;
            } catch (e) {
                console.warn(`Bar chart render gagal untuk #${canvasId}:`, e.message);
                delete this.chartInstances[canvasId];
            }
        },

        renderAllCharts() {
            if (this.currentPage === 'dashboard') {
                // Hanya render chart admin/pembina/pimpinan jika bukan penghuni
                if (this.currentRole !== 'penghuni') {
                    const sd = this.laporanStatus;
                    this.renderDonutChart('chart-status-penghuni', sd.map(s => s.label), sd.map(s => s.jumlah), sd.map(s => s.warna), String(this.penghuni.length));
                    const hd = this.laporanHunianBarak;
                    this.renderDonutChart('chart-hunian-barak', hd.map(h => h.label), hd.map(h => h.jumlah), hd.map(h => h.warna), this.hunianPersen + '%');

                    // Grafik Kehadiran 7 Hari Terakhir
                    const days7Labels = [];
                    const days7Data = [];
                    for (let i = 6; i >= 0; i--) {
                        const d = new Date();
                        d.setDate(d.getDate() - i);
                        const key = d.toISOString().slice(0, 10);
                        const label = d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' });
                        const count = this.presensi.filter(r => r.tanggal === key).length;
                        days7Labels.push(label);
                        days7Data.push(count);
                    }
                    this.renderBarChart('chart-kehadiran-mingguan', days7Labels, days7Data, '#3b82f6', 'Hadir');
                }
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

                    // Sinkronkan nama ke data akun (users) jika ada akun yang terhubung ke NIK ini
                    const userLinkedIdx = this.users.findIndex(u => u.nik === data.nik);
                    if (userLinkedIdx !== -1) {
                        this.users[userLinkedIdx].nama = data.nama;
                        this.saveExtraData();
                    }

                    // Jika yang sedang login adalah penghuni ini, perbarui nama profil seketika
                    if (this.currentRole === 'penghuni' && this.currentNik === data.nik) {
                        this.userProfile.name = data.nama;
                        this.saveUserData();
                    }

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
        openProfileModal(tab = 'profile') {
            this.activeTab = tab;
            // Selalu muat nama dan kontak terbaru sesuai role yang aktif
            if (this.currentRole === 'penghuni') {
                const p = this.myPenghuni;
                if (p) {
                    this.userProfile.name = p.nama || '';
                    if (p.no_hp) this.userProfile.phone = p.no_hp;
                } else {
                    const u = this._currentUserRecord();
                    if (u) this.userProfile.name = u.nama || '';
                }
            } else {
                const u = this._currentUserRecord();
                if (u && !this.userProfile.name) this.userProfile.name = u.nama || '';
            }
            this.profileModalOpen = true;
        },

        uploadPhoto(event) {
            const file = event.target.files[0];
            if (!file?.type.startsWith('image/')) return Swal.fire('Error', 'Hanya file gambar yang diperbolehkan', 'error');
            const reader = new FileReader();
            reader.onload = e => {
                this.userProfile = { ...this.userProfile, photo: e.target.result };
                this.saveUserData();
            };
            reader.readAsDataURL(file);
        },

        removePhoto() {
            this.userProfile = { ...this.userProfile, photo: '' };
            this.saveUserData();
            Swal.fire({ icon: 'success', title: 'Foto Profil Dihapus', timer: 1200, showConfirmButton: false });
        },

        saveProfile() {
            if (!this.userProfile.name?.trim()) return Swal.fire('Error', 'Nama lengkap wajib diisi', 'error');
            this.saving = true;
            setTimeout(() => {
                const newName = this.userProfile.name.trim();

                // 1. Sinkronkan ke master data penghuni jika role penghuni atau akun terhubung NIK
                const targetNik = this.currentNik || this._currentUserRecord()?.nik;
                if (targetNik) {
                    const pIdx = this.penghuni.findIndex(p => p.nik === targetNik);
                    if (pIdx !== -1) {
                        this.penghuni[pIdx].nama = newName;
                        if (this.userProfile.phone) this.penghuni[pIdx].no_hp = this.userProfile.phone;
                        this.saveToStorage();
                    }
                }

                // 2. Sinkronkan ke data akun users
                const idx = this.users.findIndex(u => String(u.id) === String(this.currentUserId)
                    || (u.username || '').toLowerCase() === (this.currentUsername || '').toLowerCase()
                    || (targetNik && u.nik === targetNik));
                if (idx !== -1) {
                    this.users[idx].nama = newName;
                }

                // 3. Sinkronkan ke kartu anggota jika sedang terbuka
                if (this.kartuPenghuni) {
                    this.kartuPenghuni.nama = newName;
                }

                this.saveExtraData();
                this.saveUserData();
                this.saving = false;
                this.profileModalOpen = false;
                Swal.fire({ icon: 'success', title: 'Berhasil!', text: 'Profil dan Kartu Penghuni berhasil diperbarui', timer: 1500, showConfirmButton: false });
            }, 600);
        },

        saveSettings() {

            const akun = this._currentUserRecord();
            if (this.settings.newPassword || this.settings.oldPassword) {
                if (!akun) return Swal.fire('Error', 'Data akun tidak ditemukan. Silakan login ulang.', 'error');
                if (this.settings.oldPassword !== akun.password) return Swal.fire('Error', 'Kata sandi lama tidak sesuai', 'error');
                if (this.settings.newPassword !== this.settings.confirmPassword) return Swal.fire('Error', 'Konfirmasi kata sandi tidak cocok', 'error');
                if (this.settings.newPassword.length < 6) return Swal.fire('Error', 'Kata sandi minimal 6 karakter', 'error');
            }
            this.saving = true;
            setTimeout(() => {
                // Simpan kata sandi baru ke data akun sesungguhnya (this.users), bukan
                // hanya ke pengaturan lokal, supaya login berikutnya memakai sandi baru.
                if (this.settings.newPassword && akun) {
                    const idx = this.users.findIndex(u => String(u.id) === String(akun.id));
                    if (idx !== -1) this.users[idx].password = this.settings.newPassword;
                    this.saveExtraData();
                }
                this.saveUserData();
                this.settings.oldPassword = ''; this.settings.newPassword = ''; this.settings.confirmPassword = '';
                this.saving = false;
                this.profileModalOpen = false;
                Swal.fire({ icon: 'success', title: 'Berhasil!', text: 'Pengaturan disimpan', timer: 1500, showConfirmButton: false });
            }, 600);
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
                        sessionStorage.removeItem('isLoggedIn');
                        sessionStorage.removeItem('loggedInUser');
                        sessionStorage.removeItem('loggedInUsername');
                        sessionStorage.removeItem('loggedInRole');
                        sessionStorage.removeItem('loggedInUserId');
                        sessionStorage.removeItem('loggedInNik');
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