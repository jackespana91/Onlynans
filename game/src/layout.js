/* Cameras: one portrait world, re-framed for desktop. Overlays (clips, menus) live at x+3000 and get their own camera. */
(function () {
  const { W, H } = GameConst, OX = GameConst.OX, P = Game.prototype;
  P.setupCams = function () {
    const c = this.cameras; this.ov = 0;
    this.camBg = c.main; this.camA = c.add(0, 0, W, H); this.camB = c.add(0, 0, 10, 10); this.camC = c.add(0, 0, 10, 10); this.camDim = c.add(0, 0, W, H); this.camOv = c.add(0, 0, W, H);
    this.bgWide = this.add.image(-3000, 0, this.textures.exists('bg_land') ? 'bg_land' : 'bg').setOrigin(0).setDisplaySize(1600, 900);
    const deco = this.add.graphics(); this.deco = deco;
    this.dimRect = this.add.rectangle(-8000, 0, 4000, 4000, 0x07020f, 0.82).setVisible(false).setInteractive();
    this.camDim.centerOn(-8000, 0);
  };
  P.shake = function (d, i) { [this.camA, this.camB, this.camC, this.camOv].forEach(c => c.visible && c.shake(d, i)); };
  P.ovOn = function () { this.ov++; this.dimRect.setVisible(this.land || false).setAlpha(this.live ? 0.82 : 1); };
  P.ovOff = function () { this.ov = Math.max(0, this.ov - 1); if (!this.ov) this.dimRect.setVisible(false); };
  const place = (cam, wx, wy, ww, wh, sx, sy, sc) => { cam.setVisible(true).setViewport(Math.round(sx), Math.round(sy), Math.round(ww * sc), Math.round(wh * sc)).setZoom(sc).centerOn(wx + ww / 2, wy + wh / 2); };
  P.applyLayout = function (land) {
    this.land = land; const LW = 1600, LH = 900;
    this.bgImg.setVisible(!land); this.dimRect.setVisible(land && this.ov > 0); this.deco.clear();
    if (!land) {
      this.camBg.setViewport(0, 0, W, H).setScroll(-9000, 0); place(this.camA, 0, 0, W, H, 0, 0, 1); this.camB.setVisible(false); this.camC.setVisible(false);
      this.camDim.setViewport(0, 0, W, H); place(this.camOv, OX, 0, W, H, 0, 0, 1); return;
    }
    const bar = 120, sh = 764, g = (LH - bar - 16) / 696, gw = W * g, x0 = (LW - 740 - 16 - gw) / 2;
    this.camBg.setViewport(0, 0, LW, LH).setZoom(1).setScroll(-3000, 0);
    place(this.camA, -12000, 0, 740, sh, x0, 8, 1); place(this.camB, 0, 394, W, 696, x0 + 740 + 16, 8, g); place(this.camC, 0, 1400, LW, bar, 0, LH - bar, 1);
    this.camDim.setViewport(0, 0, LW, LH); const os = LH / H; place(this.camOv, OX, 0, W, H, (LW - W * os) / 2, 0, os);
  };
})();
