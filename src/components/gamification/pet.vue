<template>
    <div>
        <div class="pet">
            <div id="runner"></div>
        </div>
    </div>
</template>

<style>
.pet {
    position: fixed;
    bottom: 0;
}

#runner {
    background: url("../../assets/panda_colour.png");
    width: 62.5px;
    height: 82.5px;
    animation: walk 10s steps(12) infinite;
    background-size: 750px 88.5px;
}

@keyframes walk {
    0% {
        background-position: 0px;
        transform: translateX(0) scaleX(1);
    }
    49.999999999999% {
        background-position: 3000px;
        transform: translateX(1200px) scaleX(1);
    }
    50% {
        background-position: 3000px;
        transform: translateX(1200px) scaleX(-1);
    }
    100% {
        background-position: 0px;
        transform: translateX(0) scaleX(-1);
    }
}
#ball {
    z-index: 99999;
    width: 100px;
    height: 100px;
    position: absolute;
    cursor: grab;
    background-image: url("../../assets/bunnyStill.png");
    background-repeat: no-repeat;
}
.draggable {
    cursor: grab;
}

.dragging {
    cursor: grabbing;
    background-image: url("../../assets/bunnyAir.png") !important;
}
.falling {
    background-image: url("../../assets/bunnyAir.png") !important;
}
</style>

<script>
export default {
    data() {
        return {
            isDragging: false,
            velocityY: 0,
            gravity: 0.2,
            initialClickX: 0,
            initialClickY: 0,
        };
    },
    methods: {
        //   startDragging(e) {
        //     this.isDragging = true;
        //     this.$refs.ball.classList.add('dragging');
        //     this.initialClickX = e.clientX - this.$refs.ball.offsetLeft;
        //     this.initialClickY = e.clientY - this.$refs.ball.offsetTop;
        //   },
        //   dragBall(e) {
        //     if (this.isDragging) {
        //       const newX = e.clientX - this.initialClickX;
        //       const newY = e.clientY - this.initialClickY;
        //       const maxX = document.documentElement.scrollWidth - this.$refs.ball.offsetWidth;
        //       const maxY = document.documentElement.scrollHeight - this.$refs.ball.offsetHeight;
        //       this.$refs.ball.style.left = `${Math.min(Math.max(newX, 0), maxX)}px`;
        //       this.$refs.ball.style.top = `${Math.min(Math.max(newY, 0), maxY)}px`;
        //     }
        //   },
        //   stopDragging() {
        //     this.isDragging = false;
        //     this.$refs.ball.classList.remove('dragging');
        //   },
        //   stopDraggingOutside(e) {
        //     if (this.isDragging) {
        //       this.isDragging = false;
        //       this.$refs.ball.classList.remove('dragging');
        //     }
        //   },
        //   updateBallPosition() {
        //     const maxY = document.documentElement.scrollHeight - this.$refs.ball.offsetHeight;
        //     // Reset Y-axis speed when touching the ground
        //     if (!this.isDragging && this.$refs.ball.offsetTop >= maxY) {
        //       this.velocityY = 0;
        //       ball.classList.remove('falling');
        //       this.$refs.ball.style.top = `${maxY}px`;
        //     }
        //    // Start dragging
        //     else if (!this.isDragging) {
        //       this.velocityY += this.gravity;
        //       ball.classList.add('falling');
        //       this.$refs.ball.style.top = `${Math.min(this.$refs.ball.offsetTop + this.velocityY, maxY)}px`;
        //     }
        //     const maxX = document.documentElement.scrollWidth - this.$refs.ball.offsetWidth;
        //     this.$refs.ball.style.left = `${Math.min(Math.max(this.$refs.ball.offsetLeft, 0), maxX)}px`;
        //     requestAnimationFrame(this.updateBallPosition);
        //   },
        // },
        // mounted() {
        //   this.updateBallPosition();
        //   document.addEventListener('mouseup', this.stopDraggingOutside);
        // },
        // beforeDestroy() {
        //   // Clean up the event listener when the component is being destroyed
        //   document.removeEventListener('mouseup', this.stopDraggingOutside);
    },
};
</script>
