<script lang="ts">
    import {homeVisited} from "../../scripts/stores/homeVisitStore";
    import {prefersReducedMotionStore} from "../../scripts/stores/prefersReducedMotionStore";
    import {onDestroy} from "svelte";

    let prefersReducedMotion; // Stores whether the user prefers reduced motion
    let visited: boolean = undefined; // Stores whether the user has visited the home page before
    const prefersReducedMotionUnsubscribe = prefersReducedMotionStore.subscribe((value) => {
        if (prefersReducedMotion == undefined) prefersReducedMotion = value;
    });

    const homeVisitedUnsubscribe = homeVisited.subscribe((value) => {
        if (visited === undefined) {
            visited = value;
            homeVisited.set(true);
        }
    });

    onDestroy(() => {
        prefersReducedMotionUnsubscribe();
        homeVisitedUnsubscribe();
    });
</script>


<div class="invisible md:visible">
    <div class="titleWrapper">
        <div class="box">
            <div class="title">
                {#if !(prefersReducedMotion || visited)}<span class="block bg-primary-600 z-10"></span>{/if}
                <h1 class="font-medium text-shadow dark:text-shadow-none text-white focus:outline-none z-10 {!visited ? 'fadeIn' : ''}">Praxis M.-A. Rojzman<span></span></h1>
            </div>
            <div class="role">
                {#if !(prefersReducedMotion || visited)}<div class="block z-10"></div>{/if}
                <p class="text-gray-600 z-10 dark:text-white {!visited ? 'fadeIn' : ''}">Fachärztin für Allgemeinmedizin</p>
            </div>
        </div>
    </div>
</div>

<style lang="scss">

  .titleWrapper {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
    width: 100%;
    height: 75vh;
    background: transparent;
    display: flex;
    flex-direction: row;
    justify-content: right;
    align-items: flex-end;
    overflow-x: clip;

    .box {
      display: flex;
      justify-content: center;
      flex-direction: column;

      .title {
        margin-right: 1vw;
        position: relative;
        display: flex;
        align-items: center;
        height: 85px;

        .block {
          width: 0;
          height: inherit;
          position: absolute;
          animation: mainBlock 1.5s cubic-bezier(.74, .06, .4, .92) forwards;
          animation-delay: 0.1s;
          display: flex;
        }

        h1 {
          font-size: 74px;
          display: flex;
          align-items: baseline;
          position: relative;
        }

        .fadeIn {
          animation: mainFadeIn 1s forwards;
          animation-delay: 1.3s;
          opacity: 0;
        }
      }

      .role {
        width: 100%;
        position: relative;
        display: flex;
        align-items: flex-end;
        height: 30px;
        margin-top: -10px;

        .block {
          width: 0;
          height: inherit;
          background: #FFF;
          position: absolute;
          animation: secBlock 1.2s cubic-bezier(.74, .06, .4, .92) forwards;
          animation-delay: 1.6s;
          display: flex;
        }

        p {
          padding-left: 6px;
          font-weight: 400;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 5px;
        }

        .fadeIn {
          animation: secFadeIn 1.2s forwards;
          animation-delay: 2.4s;
          opacity: 0;
        }
      }
    }
  }

  @keyframes mainBlock {
    0% {
      width: 0;
      left: 0;

    }
    50% {
      width: 100%;
      left: 0;

    }
    100% {
      width: 0;
      left: 100%;
    }
  }

  @keyframes mainFadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @keyframes secBlock {
    0% {
      width: 0;
      left: 0;

    }
    50% {
      width: 100%;
      left: 0;

    }
    100% {
      width: 0;
      left: 100%;
    }
  }

  @keyframes secFadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
</style>