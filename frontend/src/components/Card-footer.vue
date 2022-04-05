<template>
    <footer class="footer">
        <div class="footer_logo">
            <img class="footer_logo_img" src="../images/logo/icon-left-font-monochrome-white.svg" alt="">
        </div>

    </footer>
  
</template>

<script>
export default {
name: 'Card-footer',
}
</script>

<style lang="scss">
@import '../assets/scss/scss';
.footer {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 80px;
    background-color: $color-primary;
    color: $color-primary;
    &_logo_img {
        width: 150px;
        
    }
}

</style>