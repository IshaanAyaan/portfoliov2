// Copyright 2024 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import { FPS, IS_HIDPI, IS_MOBILE } from './constants.js';
import { CollisionBox } from './offline-sprite-definitions.js';
import { getRandomNum } from './utils.js';

export class Obstacle {
  /**
   * Obstacle.
   * @param {CanvasRenderingContext2D} canvasCtx
   * @param {ObstacleType} type
   * @param {Object} spriteImgPos Obstacle position in sprite.
   * @param {Object} dimensions
   * @param {number} gapCoefficient Mutipler in determining the gap.
   * @param {number} speed
   * @param {number=} opt_xOffset
   * @param {boolean=} opt_isAltGameMode
   */
  constructor(
    canvasCtx,
    type,
    spriteImgPos,
    dimensions,
    gapCoefficient,
    speed,
    opt_xOffset,
    opt_isAltGameMode
  ) {
    this.canvasCtx = canvasCtx;
    this.spritePos = spriteImgPos;
    this.typeConfig = type;
    this.gapCoefficient = window.Runner.slowDown
      ? gapCoefficient * 2
      : gapCoefficient;
    this.size = getRandomNum(1, Obstacle.MAX_OBSTACLE_LENGTH);
    this.dimensions = dimensions;
    this.remove = false;
    this.xPos = dimensions.WIDTH + (opt_xOffset || 0);
    this.yPos = 0;
    this.width = 0;
    this.collisionBoxes = [];
    this.gap = 0;
    this.speedOffset = 0;
    this.altGameModeActive = opt_isAltGameMode;
    this.imageSprite =
      this.typeConfig.type === 'COLLECTABLE'
        ? window.Runner.altCommonImageSprite
        : this.altGameModeActive
        ? window.Runner.altGameImageSprite
        : window.Runner.imageSprite;

    // For animated obstacles.
    this.currentFrame = 0;
    this.timer = 0;

    this.init(speed);
  }

  /**
   * Initialise the DOM for the obstacle.
   * @param {number} speed
   */
  init(speed) {
    this.cloneCollisionBoxes();

    // Only allow sizing if we're at the right speed.
    if (this.size > 1 && this.typeConfig.multipleSpeed > speed) {
      this.size = 1;
    }

    this.width = this.typeConfig.width * this.size;

    // Check if obstacle can be positioned at various heights.
    if (Array.isArray(this.typeConfig.yPos)) {
      const yPosConfig = IS_MOBILE
        ? this.typeConfig.yPosMobile
        : this.typeConfig.yPos;
      this.yPos = yPosConfig[getRandomNum(0, yPosConfig.length - 1)];
    } else {
      this.yPos = this.typeConfig.yPos;
    }

    this.draw();

    // Make collision box adjustments,
    // Central box is adjusted to the size as one box.
    //      ____        ______        ________
    //    _|   |-|    _|     |-|    _|       |-|
    //   | |<->| |   | |<--->| |   | |<----->| |
    //   | | 1 | |   | |  2  | |   | |   3   | |
    //   |_|___|_|   |_|_____|_|   |_|_______|_|
    //
    if (this.size > 1) {
      this.collisionBoxes[1].width =
        this.width -
        this.collisionBoxes[0].width -
        this.collisionBoxes[2].width;
      this.collisionBoxes[2].x = this.width - this.collisionBoxes[2].width;
    }

    // For obstacles that go at a different speed from the horizon.
    if (this.typeConfig.speedOffset) {
      this.speedOffset =
        Math.random() > 0.5
          ? this.typeConfig.speedOffset
          : -this.typeConfig.speedOffset;
    }

    this.gap = this.getGap(this.gapCoefficient, speed);

    // Increase gap for audio cues enabled.
    if (window.Runner.audioCues) {
      this.gap *= 2;
    }
  }

  /**
   * Draw and crop based on size.
   */
  draw() {
    if (window.Runner.cosmicMode !== false) {
      this.drawCosmic();
      return;
    }

    let sourceWidth = this.typeConfig.width;
    let sourceHeight = this.typeConfig.height;

    if (IS_HIDPI) {
      sourceWidth *= 2;
      sourceHeight *= 2;
    }

    // X position in sprite.
    let sourceX =
      sourceWidth * this.size * (0.5 * (this.size - 1)) + this.spritePos.x;

    // Animation frames.
    if (this.currentFrame > 0) {
      sourceX += sourceWidth * this.currentFrame;
    }

    this.canvasCtx.drawImage(
      this.imageSprite,
      sourceX,
      this.spritePos.y,
      sourceWidth * this.size,
      sourceHeight,
      this.xPos,
      this.yPos,
      this.typeConfig.width * this.size,
      this.typeConfig.height
    );
  }

  /** Draw original collision shapes as a procedural cosmic obstacle. */
  drawCosmic() {
    const ctx = this.canvasCtx;
    const x = this.xPos;
    const y = this.yPos;
    const width = this.typeConfig.width * this.size;
    const height = this.typeConfig.height;
    const lightTheme = document.documentElement.dataset.theme === 'light' ||
      (!document.documentElement.dataset.theme && matchMedia('(prefers-color-scheme: light)').matches);
    const ink = lightTheme ? '#15201a' : '#e9f0e8';
    const muted = lightTheme ? '#5b6b62' : '#85958c';

    ctx.save();
    ctx.translate(x, y);

    if (this.typeConfig.type === 'COLLECTABLE') {
      const pulse = 1 + Math.sin(performance.now() / 180) * 0.08;
      ctx.translate(width / 2, height / 2);
      ctx.scale(pulse, pulse);
      ctx.rotate(Math.PI / 4);
      ctx.shadowColor = '#c9f19a';
      ctx.shadowBlur = 12;
      ctx.fillStyle = '#c9f19a';
      ctx.fillRect(-6, -6, 12, 12);
      ctx.shadowBlur = 0;
      ctx.strokeStyle = lightTheme ? '#1d3a1f' : '#071008';
      ctx.strokeRect(-3, -3, 6, 6);
      ctx.restore();
      return;
    }

    if (this.typeConfig.type === 'PTERODACTYL') {
      ctx.strokeStyle = ink;
      ctx.fillStyle = muted;
      ctx.lineWidth = 1.5;
      ctx.fillRect(width * .36, height * .35, width * .28, height * .3);
      ctx.strokeRect(width * .36, height * .35, width * .28, height * .3);
      ctx.fillStyle = lightTheme ? '#b5c5bd' : '#32433a';
      const wingY = this.currentFrame ? height * .18 : height * .28;
      ctx.fillRect(0, wingY, width * .34, height * .32);
      ctx.fillRect(width * .66, wingY, width * .34, height * .32);
      ctx.beginPath();
      ctx.moveTo(width / 2, height * .35);
      ctx.lineTo(width / 2, height * .05);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(width / 2, height * .04, 2, 0, Math.PI * 2);
      ctx.fillStyle = '#c9f19a';
      ctx.fill();
      ctx.restore();
      return;
    }

    ctx.fillStyle = lightTheme ? '#6f776f' : '#677169';
    ctx.strokeStyle = ink;
    ctx.lineWidth = 1.25;
    for (let index = 0; index < this.size; index++) {
      const unit = this.typeConfig.width;
      const cx = index * unit + unit / 2;
      const radiusX = Math.max(7, unit * .48);
      const radiusY = Math.max(12, height * .48);
      ctx.beginPath();
      ctx.moveTo(cx - radiusX, height * .58);
      ctx.lineTo(cx - radiusX * .58, height * .14);
      ctx.lineTo(cx + radiusX * .12, 0);
      ctx.lineTo(cx + radiusX * .78, height * .22);
      ctx.lineTo(cx + radiusX, height * .68);
      ctx.lineTo(cx + radiusX * .35, height);
      ctx.lineTo(cx - radiusX * .55, height * .92);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx - radiusX * .18, height * .42, Math.max(2, unit * .12), 0, Math.PI * 2);
      ctx.strokeStyle = muted;
      ctx.stroke();
    }
    ctx.restore();
  }

  /**
   * Obstacle frame update.
   * @param {number} deltaTime
   * @param {number} speed
   */
  update(deltaTime, speed) {
    if (!this.remove) {
      if (this.typeConfig.speedOffset) {
        speed += this.speedOffset;
      }
      this.xPos -= Math.floor(((speed * FPS) / 1000) * deltaTime);

      // Update frame
      if (this.typeConfig.numFrames) {
        this.timer += deltaTime;
        if (this.timer >= this.typeConfig.frameRate) {
          this.currentFrame =
            this.currentFrame === this.typeConfig.numFrames - 1
              ? 0
              : this.currentFrame + 1;
          this.timer = 0;
        }
      }
      this.draw();

      if (!this.isVisible()) {
        this.remove = true;
      }
    }
  }

  /**
   * Calculate a random gap size.
   * - Minimum gap gets wider as speed increases
   * @param {number} gapCoefficient
   * @param {number} speed
   * @return {number} The gap size.
   */
  getGap(gapCoefficient, speed) {
    const minGap = Math.round(
      this.width * speed + this.typeConfig.minGap * gapCoefficient
    );
    const maxGap = Math.round(minGap * Obstacle.MAX_GAP_COEFFICIENT);
    return getRandomNum(minGap, maxGap);
  }

  /**
   * Check if obstacle is visible.
   * @return {boolean} Whether the obstacle is in the game area.
   */
  isVisible() {
    return this.xPos + this.width > 0;
  }

  /**
   * Make a copy of the collision boxes, since these will change based on
   * obstacle type and size.
   */
  cloneCollisionBoxes() {
    const { collisionBoxes } = this.typeConfig;

    for (let i = collisionBoxes.length - 1; i >= 0; i--) {
      this.collisionBoxes[i] = new CollisionBox(
        collisionBoxes[i].x,
        collisionBoxes[i].y,
        collisionBoxes[i].width,
        collisionBoxes[i].height
      );
    }
  }
}

/**
 * Coefficient for calculating the maximum gap.
 */
Obstacle.MAX_GAP_COEFFICIENT = 1.5;

/**
 * Maximum obstacle grouping count.
 */
Obstacle.MAX_OBSTACLE_LENGTH = 3;
