// app/components/PageLayout.tsx

import React, { useEffect } from 'react';
import {
  useParams,
  Form,
  Await,
  useRouteLoaderData,
} from '@remix-run/react';
import useWindowScroll from 'react-use/esm/useWindowScroll';
import { Menu } from '@headlessui/react'; // 引入 Menu 組件
import { Suspense } from 'react';
import { CartForm } from '@shopify/hydrogen';

import { type LayoutQuery } from 'storefrontapi.generated';
import { Text, Heading, Section } from '~/components/Text';
import { Link } from '~/components/Link';
import { Cart } from '~/components/Cart';
import { CartLoading } from '~/components/CartLoading';
import { Input } from '~/components/Input';
import { Drawer, useDrawer } from '~/components/Drawer';
import { CountrySelector } from '~/components/CountrySelector';
import {
  IconMenu,
  IconCaret,
  IconLogin,
  IconAccount,
  IconBag,
  IconSearch,
} from '~/components/Icon';
import {
  type EnhancedMenu,
  type ChildEnhancedMenuItem,
  useIsHomePath,
} from '~/lib/utils';
import { useIsHydrated } from '~/hooks/useIsHydrated';
import { useCartFetchers } from '~/hooks/useCartFetchers';
import type { RootLoader } from '~/root';
import { useSellerAuth } from '~/components/Marketplace/SellerAuthProvider'; // 使用 useSellerAuth
import { User } from '~/lib/type'; // 引入 User 類型

type LayoutProps = {
  children: React.ReactNode;
  layout?: LayoutQuery & {
    headerMenu?: EnhancedMenu | null;
    footerMenu?: EnhancedMenu | null;
  };
};

export function PageLayout({ children, layout }: LayoutProps) {
  const { headerMenu, footerMenu } = layout || {};

  return (
    <div className="flex flex-col min-h-screen">
      <a href="#mainContent" className="sr-only">
        跳至內容
      </a>
      {headerMenu && layout?.shop.name && (
        <Header title={layout.shop.name} menu={headerMenu} />
      )}
      <main role="main" id="mainContent" className="flex-grow">
        {children}
      </main>
      {footerMenu && <Footer menu={footerMenu} />}
    </div>
  );
}

function Header({
  title,
  menu,
}: {
  title: string;
  menu?: EnhancedMenu;
}) {
  const isHome = useIsHomePath();

  const {
    isOpen: isCartOpen,
    openDrawer: openCart,
    closeDrawer: closeCart,
  } = useDrawer();

  const {
    isOpen: isMenuOpen,
    openDrawer: openMenu,
    closeDrawer: closeMenu,
  } = useDrawer();

  const addToCartFetchers = useCartFetchers(CartForm.ACTIONS.LinesAdd);

  // 獲取賣家認證狀態
  const { user, loading } = useSellerAuth();

  // 根據添加到購物車的請求狀態控制購物車抽屜的打開
  useEffect(() => {
    if (isCartOpen || !addToCartFetchers.length) return;
    openCart();
  }, [addToCartFetchers, isCartOpen, openCart]);

  return (
    <>
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
      {menu && (
        <MenuDrawer isOpen={isMenuOpen} onClose={closeMenu} menu={menu} />
      )}
      <DesktopHeader
        isHome={isHome}
        title={title}
        menu={menu}
        openCart={openCart}
        user={user}
        loading={loading}
      />
      <MobileHeader
        isHome={isHome}
        title={title}
        openCart={openCart}
        openMenu={openMenu}
        user={user}
        loading={loading}
      />
    </>
  );
}

function DesktopHeader({
  isHome,
  menu,
  openCart,
  title,
  user,
  loading,
}: {
  isHome: boolean;
  openCart: () => void;
  menu?: EnhancedMenu;
  title: string;
  user: User | null;
  loading: boolean;
}) {
  const params = useParams();
  const { y } = useWindowScroll();

  // 將賣家按鈕的條件渲染提取到變數中
  let sellerButton;

  if (loading) {
    sellerButton = <span className="w-8 h-8"></span>; // 加載狀態的佔位符
  } else if (user && user.roles.includes('seller')) {
    sellerButton = (
      <Menu as="div" className="relative inline-block text-left">
        <Menu.Button className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md">
          賣家中心
          <IconCaret direction="down" />
        </Menu.Button>
        <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right bg-white dark:bg-gray-800 divide-y divide-gray-100 rounded-md shadow-lg focus:outline-none">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <Link
                  to="/seller/dashboard"
                  className={`${
                    active ? 'bg-gray-100 dark:bg-gray-700' : ''
                  } block px-4 py-2 text-sm text-gray-700 dark:text-gray-200`}
                >
                  儀表盤
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <Link
                  to="/seller/products"
                  className={`${
                    active ? 'bg-gray-100 dark:bg-gray-700' : ''
                  } block px-4 py-2 text-sm text-gray-700 dark:text-gray-200`}
                >
                  我的產品
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <Link
                  to="/seller/newproducts"
                  className={`${
                    active ? 'bg-gray-100 dark:bg-gray-700' : ''
                  } block px-4 py-2 text-sm text-gray-700 dark:text-gray-200`}
                >
                  創建產品
                </Link>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Menu>
    );
  } else {
    sellerButton = (
      <Link
        to="/seller/login"
        className="px-4 py-2 bg-blue-500 text-white rounded-md"
      >
        賣家登入
      </Link>
    );
  }

  return (
    <header
      role="banner"
      className={`${
        isHome
          ? 'bg-primary/80 dark:bg-contrast/60 text-contrast dark:text-primary shadow-darkHeader'
          : 'bg-contrast/80 text-primary'
      } ${
        !isHome && y > 50 && ' shadow-lightHeader'
      } hidden h-nav lg:flex items-center sticky transition duration-300 backdrop-blur-lg z-40 top-0 justify-between w-full leading-none gap-8 px-12 py-8`}
    >
      <div className="flex gap-12">
        <Link className="font-bold" to="/" prefetch="intent">
          {title}
        </Link>
        <nav className="flex gap-8">
          {/* 頂部菜單項 */}
          {(menu?.items || []).map((item) => (
            <Link
              key={item.id}
              to={item.to}
              target={item.target}
              prefetch="intent"
              className={({ isActive }) =>
                isActive ? 'pb-1 border-b -mb-px' : 'pb-1'
              }
            >
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-1">
        <Form
          method="get"
          action={params.locale ? `/${params.locale}/search` : '/search'}
          className="flex items-center gap-2"
        >
          <Input
            className={
              isHome
                ? 'focus:border-contrast/20 dark:focus:border-primary/20'
                : 'focus:border-primary/20'
            }
            type="search"
            variant="minisearch"
            placeholder="搜尋"
            name="q"
          />
          <button
            type="submit"
            className="relative flex items-center justify-center w-8 h-8 focus:ring-primary/5"
          >
            <IconSearch />
          </button>
        </Form>
        {/* 賣家按鈕 */}
        {sellerButton}
        <AccountLink className="relative flex items-center justify-center w-8 h-8 focus:ring-primary/5" />
        <CartCount isHome={isHome} openCart={openCart} />
      </div>
    </header>
  );
}

// MobileHeader 與 DesktopHeader 類似，也需要修改條件渲染的部分

function MobileHeader({
  title,
  isHome,
  openCart,
  openMenu,
  user,
  loading,
}: {
  title: string;
  isHome: boolean;
  openCart: () => void;
  openMenu: () => void;
  user: User | null;
  loading: boolean;
}) {
  const params = useParams();

  // 將賣家按鈕的條件渲染提取到變數中
  let sellerButton;

  if (loading) {
    sellerButton = <span className="w-8 h-8"></span>; // 加載狀態的佔位符
  } else if (user && user.roles.includes('seller')) {
    sellerButton = (
      <Menu as="div" className="relative inline-block text-left">
        <Menu.Button className="flex items-center px-2 py-1 bg-green-500 text-white rounded-md">
          賣家中心
          <IconCaret direction="down" />
        </Menu.Button>
        <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right bg-white dark:bg-gray-800 divide-y divide-gray-100 rounded-md shadow-lg focus:outline-none">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <Link
                  to="/seller/dashboard"
                  className={`${
                    active ? 'bg-gray-100 dark:bg-gray-700' : ''
                  } block px-4 py-2 text-sm text-gray-700 dark:text-gray-200`}
                >
                  儀表盤
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <Link
                  to="/seller/products"
                  className={`${
                    active ? 'bg-gray-100 dark:bg-gray-700' : ''
                  } block px-4 py-2 text-sm text-gray-700 dark:text-gray-200`}
                >
                  我的產品
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <Link
                  to="/seller/newproducts"
                  className={`${
                    active ? 'bg-gray-100 dark:bg-gray-700' : ''
                  } block px-4 py-2 text-sm text-gray-700 dark:text-gray-200`}
                >
                  創建產品
                </Link>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Menu>
    );
  } else {
    sellerButton = (
      <Link
        to="/seller/login"
        className="px-2 py-1 bg-blue-500 text-white rounded-md"
      >
        賣家登入
      </Link>
    );
  }

  return (
    <header
      role="banner"
      className={`${
        isHome
          ? 'bg-primary/80 dark:bg-contrast/60 text-contrast dark:text-primary shadow-darkHeader'
          : 'bg-contrast/80 text-primary'
      } flex lg:hidden items-center h-nav sticky backdrop-blur-lg z-40 top-0 justify-between w-full leading-none gap-4 px-4 md:px-8`}
    >
      <div className="flex items-center justify-start w-full gap-4">
        <button
          onClick={openMenu}
          className="relative flex items-center justify-center w-8 h-8"
        >
          <IconMenu />
        </button>
        <Form
          method="get"
          action={params.locale ? `/${params.locale}/search` : '/search'}
          className="items-center gap-2 sm:flex"
        >
          <button
            type="submit"
            className="relative flex items-center justify-center w-8 h-8"
          >
            <IconSearch />
          </button>
          <Input
            className={
              isHome
                ? 'focus:border-contrast/20 dark:focus:border-primary/20'
                : 'focus:border-primary/20'
            }
            type="search"
            variant="minisearch"
            placeholder="搜尋"
            name="q"
          />
        </Form>
      </div>

      <Link
        className="flex items-center self-stretch leading-[3rem] md:leading-[4rem] justify-center flex-grow w-full h-full"
        to="/"
      >
        <Heading
          className="font-bold text-center leading-none"
          as={isHome ? 'h1' : 'h2'}
        >
          {title}
        </Heading>
      </Link>

      <div className="flex items-center justify-end w-full gap-4">
        {/* 賣家按鈕 */}
        {sellerButton}
        <AccountLink className="relative flex items-center justify-center w-8 h-8" />
        <CartCount isHome={isHome} openCart={openCart} />
      </div>
    </header>
  );
}

function CartDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const rootData = useRouteLoaderData<RootLoader>('root');
  if (!rootData) return null;

  return (
    <Drawer open={isOpen} onClose={onClose} heading="購物車" openFrom="right">
      <div className="grid">
        <Suspense fallback={<CartLoading />}>
          <Await resolve={rootData?.cart}>
            {(cart) => <Cart layout="drawer" onClose={onClose} cart={cart} />}
          </Await>
        </Suspense>
      </div>
    </Drawer>
  );
}

export function MenuDrawer({
  isOpen,
  onClose,
  menu,
}: {
  isOpen: boolean;
  onClose: () => void;
  menu: EnhancedMenu;
}) {
  return (
    <Drawer open={isOpen} onClose={onClose} openFrom="left" heading="選單">
      <div className="grid">
        <MenuMobileNav menu={menu} onClose={onClose} />
      </div>
    </Drawer>
  );
}

function MenuMobileNav({
  menu,
  onClose,
}: {
  menu: EnhancedMenu;
  onClose: () => void;
}) {
  return (
    <nav className="grid gap-4 p-6 sm:gap-6 sm:px-12 sm:py-8">
      {/* 頂部菜單項 */}
      {(menu?.items || []).map((item) => (
        <span key={item.id} className="block">
          <Link
            to={item.to}
            target={item.target}
            onClick={onClose}
            className={({ isActive }) =>
              isActive ? 'pb-1 border-b -mb-px' : 'pb-1'
            }
          >
            <Text as="span" size="copy">
              {item.title}
            </Text>
          </Link>
        </span>
      ))}
    </nav>
  );
}

function AccountLink({ className }: { className?: string }) {
  const rootData = useRouteLoaderData<RootLoader>('root');
  const isLoggedIn = rootData?.isLoggedIn;

  return (
    <Link to="/account" className={className}>
      <Suspense fallback={<IconLogin />}>
        <Await resolve={isLoggedIn} errorElement={<IconLogin />}>
          {(isLoggedIn) => (isLoggedIn ? <IconAccount /> : <IconLogin />)}
        </Await>
      </Suspense>
    </Link>
  );
}

function CartCount({
  isHome,
  openCart,
}: {
  isHome: boolean;
  openCart: () => void;
}) {
  const rootData = useRouteLoaderData<RootLoader>('root');
  if (!rootData) return null;

  return (
    <Suspense fallback={<Badge count={0} dark={isHome} openCart={openCart} />}>
      <Await resolve={rootData?.cart}>
        {(cart) => (
          <Badge
            dark={isHome}
            openCart={openCart}
            count={cart?.totalQuantity || 0}
          />
        )}
      </Await>
    </Suspense>
  );
}

function Badge({
  openCart,
  dark,
  count,
}: {
  count: number;
  dark: boolean;
  openCart: () => void;
}) {
  const isHydrated = useIsHydrated();

  const BadgeCounter = React.useMemo(
    () => (
      <>
        <IconBag />
        <div
          className={`${
            dark
              ? 'text-primary bg-contrast dark:text-contrast dark:bg-primary'
              : 'text-contrast bg-primary'
          } absolute bottom-1 right-1 text-[0.625rem] font-medium subpixel-antialiased h-3 min-w-[0.75rem] flex items-center justify-center leading-none text-center rounded-full w-auto px-[0.125rem] pb-px`}
        >
          <span>{count || 0}</span>
        </div>
      </>
    ),
    [count, dark],
  );

  return isHydrated ? (
    <button
      onClick={openCart}
      className="relative flex items-center justify-center w-8 h-8 focus:ring-primary/5"
    >
      {BadgeCounter}
    </button>
  ) : (
    <Link
      to="/cart"
      className="relative flex items-center justify-center w-8 h-8 focus:ring-primary/5"
    >
      {BadgeCounter}
    </Link>
  );
}

function Footer({ menu }: { menu?: EnhancedMenu }) {
  const isHome = useIsHomePath();
  const itemsCount = menu
    ? menu?.items?.length + 1 > 4
      ? 4
      : menu?.items?.length + 1
    : [];

  return (
    <Section
      divider={isHome ? 'none' : 'top'}
      as="footer"
      role="contentinfo"
      className={`grid min-h-[25rem] items-start grid-flow-row w-full gap-6 py-8 px-6 md:px-8 lg:px-12 md:gap-8 lg:gap-12 grid-cols-1 md:grid-cols-2 lg:grid-cols-${itemsCount}
        bg-primary dark:bg-contrast dark:text-primary text-contrast overflow-hidden`}
    >
      <FooterMenu menu={menu} />
      <CountrySelector />
      <div
        className={`self-end pt-8 opacity-50 md:col-span-2 lg:col-span-${itemsCount}`}
      >
        &copy; {new Date().getFullYear()} / Shopify, Inc. Hydrogen 是一個 MIT 授權的開源專案。
      </div>
    </Section>
  );
}

function FooterLink({ item }: { item: ChildEnhancedMenuItem }) {
  if (item.to.startsWith('http')) {
    return (
      <a href={item.to} target={item.target} rel="noopener noreferrer">
        {item.title}
      </a>
    );
  }

  return (
    <Link to={item.to} target={item.target} prefetch="intent">
      {item.title}
    </Link>
  );
}

function FooterMenu({ menu }: { menu?: EnhancedMenu }) {
  const styles = {
    section: 'grid gap-4',
    nav: 'grid gap-2 pb-6',
  };

  return (
    <>
      {(menu?.items || []).map((item) => (
        <section key={item.id} className={styles.section}>
          <Menu as="div" className="relative">
            {({ open }) => (
              <>
                <Menu.Button className="text-left w-full">
                  <Heading className="flex justify-between items-center" size="lead" as="h3">
                    {item.title}
                    {item?.items?.length > 0 && (
                      <span className="ml-2">
                        <IconCaret direction={open ? 'up' : 'down'} />
                      </span>
                    )}
                  </Heading>
                </Menu.Button>
                {item?.items?.length > 0 && (
                  <Menu.Items className="absolute left-0 mt-2 w-40 origin-top-left bg-white dark:bg-gray-800 divide-y divide-gray-100 rounded-md shadow-lg focus:outline-none">
                    <div className="py-1">
                      {item.items.map((subItem: ChildEnhancedMenuItem) => (
                        <Menu.Item key={subItem.id}>
                          {({ active }) => (
                            <FooterLink
                              item={subItem}
                              className={`${
                                active ? 'bg-gray-100 dark:bg-gray-700' : ''
                              } block px-4 py-2 text-sm text-gray-700 dark:text-gray-200`}
                            />
                          )}
                        </Menu.Item>
                      ))}
                    </div>
                  </Menu.Items>
                )}
              </>
            )}
          </Menu>
        </section>
      ))}
    </>
  );
}
