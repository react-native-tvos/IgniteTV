import { Link, RouteProp, useRoute } from "@react-navigation/native"
import React, { FC, ReactElement, useEffect, useRef, useState } from "react"
import { BackHandler, FlatList, Image, ImageBackground, ImageStyle, Platform, SectionList, TextStyle, TouchableWithoutFeedback, View, ViewStyle } from "react-native"
import { Drawer } from "react-native-drawer-layout"
import { type ContentStyle } from "@shopify/flash-list"
import { ListItem, ListView, ListViewRef, Screen, Text } from "../../components"
import { isRTL } from "../../i18n"
import { DemoTabParamList, DemoTabScreenProps } from "../../navigators/DemoNavigator"
import { colors, spacing } from "../../theme"
import { useSafeAreaInsetsStyle } from "../../utils/useSafeAreaInsetsStyle"
import * as Demos from "./demos"
import { DrawerIconButton } from "./DrawerIconButton"
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring } from 'react-native-reanimated';

const logo = require("../../../assets/images/logo.png")

export interface Demo {
  name: string
  description: string
  data: ReactElement[]
}

interface DemoListItem {
  item: { name: string; useCases: string[] }
  sectionIndex: number
  handleScroll?: (sectionIndex: number, itemIndex?: number) => void
}

const slugify = (str: string) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")

const WebListItem: FC<DemoListItem> = ({ item, sectionIndex }) => {
  const sectionSlug = item.name.toLowerCase()

  return (
    <View>
      <Link to={`/showroom/${sectionSlug}`} style={$menuContainer}>
        <Text preset="bold">{item.name}</Text>
      </Link>
      {item.useCases.map((u) => {
        const itemSlug = slugify(u)

        return (
          <Link key={`section${sectionIndex}-${u}`} to={`/showroom/${sectionSlug}/${itemSlug}`}>
            <Text>{u}</Text>
          </Link>
        )
      })}
    </View>
  )
}

const NativeListItem: FC<DemoListItem> = ({ item, sectionIndex, handleScroll }) => (
  <View style={$menuContainer}>
    <Text onPress={() => handleScroll?.(sectionIndex)} preset="bold" style={$menuContainerText}>
      {item.name}
    </Text>
    {item.useCases.map((u, index) => (
      <ListItem
        key={`section${sectionIndex}-${u}`}
        onPress={() => handleScroll?.(sectionIndex, index + 1)}
        text={u}
        rightIcon={isRTL ? "caretLeft" : "caretRight"}
      />
    ))}
  </View>
)

const ShowroomDemoList = (_props: any) => {
  const handleScroll = _props.handleScroll
  return (
    <View style={[$drawer, _props.additionalStyle ?? {}]}>
      {/* <View style={$logoContainer}>
        <Image source={logo} style={$logoImage} />
      </View> */}

      <ListView<DemoListItem["item"]>
        ref={_props.menuRef}
        contentContainerStyle={$listContentContainer}
        estimatedItemSize={spacing._250}
        data={Object.values(Demos).map((d) => ({
          name: d.name,
          useCases: d.data.map((u) => u.props.name as string),
        }))}
        keyExtractor={(item) => item.name}
        renderItem={({ item, index: sectionIndex }) => (
          <ShowroomListItem {...{ item, sectionIndex, handleScroll }} />
        )}
      />
    </View>
  )
}

const ShowroomDemos = (_props: any) => {
  return (
    <SectionList
      ref={_props.listRef}
      contentContainerStyle={$sectionListContentContainer}
      stickySectionHeadersEnabled={false}
      sections={Object.values(Demos)}
      renderItem={({ item }) => item}
      renderSectionFooter={() => <View style={$demoUseCasesSpacer} />}
      ListHeaderComponent={
        <View style={$heading}>
          <Text preset="heading" tx="demoShowroomScreen.jumpStart" />
        </View>
      }
      onScrollToIndexFailed={_props.scrollToIndexFailed}
      renderSectionHeader={({ section }) => {
        return (
          <View>
            <Text preset="heading" style={$demoItemName}>
              {section.name}
            </Text>
            <Text style={$demoItemDescription}>{section.description}</Text>
          </View>
        )
      }}
    />
  )
}

const ShowroomListItem = Platform.select({ web: WebListItem, default: NativeListItem })

export const DemoShowroomScreen: FC<DemoTabScreenProps<"DemoShowroom">> =
  function DemoShowroomScreen(_props) {
    const [open, setOpen] = useState(false)
    const timeout = useRef<ReturnType<typeof setTimeout>>()
    const listRef = useRef<SectionList>(null)
    const menuRef = useRef<ListViewRef<DemoListItem["item"]>>(null)
    const route = useRoute<RouteProp<DemoTabParamList, "DemoShowroom">>()
    const params = route.params

    const $drawerInsets = useSafeAreaInsetsStyle(["top"])

    const demoValues = Object.values(Demos);
    const midpoint = Math.ceil(demoValues.length / 2);

    const firstHalf = demoValues.slice(0, midpoint);
    const secondHalf = demoValues.slice(midpoint);

    const [selectedSectionIndex, setSelectedSectionIndex] = useState<number | null>(null);


    const Card = ({ title, description, onPress }) => {
      const scaleValue = useSharedValue(1);
      const borderWidthValue = useSharedValue(0);
      const borderColorValue = useSharedValue("blue");

      const handleFocus = () => {
        scaleValue.value = withSpring(1.1);
        borderWidthValue.value = withTiming(2);
        borderColorValue.value = withTiming("blue");
      };

      const handleBlur = () => {
        scaleValue.value = withSpring(1);
        borderWidthValue.value = withTiming(0);
        borderColorValue.value = withTiming("blue");
      };

      const cardStyle = useAnimatedStyle(() => ({
        width: 240,
        aspectRatio: 16 / 9,
        margin: spacing.sm,
        padding: spacing.sm,
        backgroundColor: colors.palette.primary200,
        borderRadius: 8,
        borderWidth: borderWidthValue.value,
        borderColor: colors.palette.accent100,
        transform: [{ scale: scaleValue.value }],
        shadowOpacity: scaleValue.value === 1 ? 0 : 0.5,
        shadowRadius: scaleValue.value === 1 ? 0 : 10,
        shadowColor: '#FFFFFF',
        elevation: scaleValue.value === 1 ? 0 : 1.1,
      }));

      return (
        <View>
          <TouchableWithoutFeedback onPress={onPress} onFocus={handleFocus} onBlur={handleBlur}>
            <View>
              <Animated.View style={[$cardStyle, cardStyle, $cardShadow]}>
                <ImageBackground source={logo} resizeMode="center" style={$imageBackgroundCard} />
              </Animated.View>
            </View>
          </TouchableWithoutFeedback>
          <Text style={$cardTitle}>{title}</Text>
        </View>
      );
    };


    const renderSection = ({ item: section }) => (
      <Card
        title={section.name}
        description={section.description}
        onPress={() => setSelectedSectionIndex(Object.values(Demos).findIndex((d) => d.name === section.name))}
      ></Card>

    );

    if (Platform.isTV) {
      useEffect(() => {
        const handleBackButton = () => {
          if (selectedSectionIndex !== null) {
            setSelectedSectionIndex(null);
            return true;
          }
          return false;
        };

        const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButton);

        return () => {
          backHandler.remove();
          timeout.current && clearTimeout(timeout.current);
        };
      }, [selectedSectionIndex]);
    }

    // handle Web links
    React.useEffect(() => {
      if (params !== undefined && Object.keys(params).length > 0) {
        const demoValues = Object.values(Demos)
        const findSectionIndex = demoValues.findIndex(
          (x) => x.name.toLowerCase() === params.queryIndex,
        )
        let findItemIndex = 0
        if (params.itemIndex) {
          try {
            findItemIndex =
              demoValues[findSectionIndex].data.findIndex(
                (u) => slugify(u.props.name) === params.itemIndex,
              ) + 1
          } catch (err) {
            console.error(err)
          }
        }
        handleScroll(findSectionIndex, findItemIndex)
      }
    }, [params])

    const toggleDrawer = () => {
      if (!open) {
        setOpen(true)
      } else {
        setOpen(false)
      }
    }

    const handleScroll = (sectionIndex: number, itemIndex = 0) => {
      listRef.current?.scrollToLocation({
        animated: true,
        itemIndex,
        sectionIndex,
      })
      toggleDrawer()
    }

    const scrollToIndexFailed = (info: {
      index: number
      highestMeasuredFrameIndex: number
      averageItemLength: number
    }) => {
      listRef.current?.getScrollResponder()?.scrollToEnd()
      timeout.current = setTimeout(
        () =>
          listRef.current?.scrollToLocation({
            animated: true,
            itemIndex: info.index,
            sectionIndex: 0,
          }),
        50,
      )
    }

    useEffect(() => {
      return () => timeout.current && clearTimeout(timeout.current)
    }, [])

    if (Platform.isTV) {
      return (
        <View style={$tvScreenContainer}>
          <View style={$tvMainContentContainer}>
            {selectedSectionIndex !== null ? (
              <SectionList
                ref={listRef}
                contentContainerStyle={$sectionListContentContainer}
                stickySectionHeadersEnabled={false}
                sections={[Object.values(Demos)[selectedSectionIndex]]}
                renderItem={({ item }) => item}
                renderSectionFooter={() => <View style={$demoUseCasesSpacer} />}
                onScrollToIndexFailed={scrollToIndexFailed}
                renderSectionHeader={({ section }) => {
                  return (
                    <View>
                      <Text preset="heading" style={$demoItemName}>
                        {section.name}
                      </Text>
                      <Text style={$demoItemDescription}>{section.description}</Text>
                    </View>
                  );
                }}
              />
            ) : (
              <View>
                <FlatList
                  data={firstHalf}
                  renderItem={renderSection}
                  keyExtractor={(item) => item.name}
                  contentContainerStyle={$sectionListContainer}
                  numColumns={1}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                />
                <FlatList
                  data={secondHalf}
                  renderItem={renderSection}
                  keyExtractor={(item) => item.name}
                  contentContainerStyle={$sectionListContainer}
                  numColumns={1}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                />
              </View>
            )}
          </View>
        </View>
      )
    }

    return (
      <Drawer
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        drawerType={"slide"}
        drawerPosition={isRTL ? "right" : "left"}
        renderDrawerContent={() => (
          <View style={[$drawer, $drawerInsets]}>
            <View style={$logoContainer}>
              <Image source={logo} style={$logoImage} />
            </View>

            <ListView<DemoListItem["item"]>
              ref={menuRef}
              contentContainerStyle={$listContentContainer}
              estimatedItemSize={250}
              data={Object.values(Demos).map((d) => ({
                name: d.name,
                useCases: d.data.map((u) => u.props.name as string),
              }))}
              keyExtractor={(item) => item.name}
              renderItem={({ item, index: sectionIndex }) => (
                <ShowroomListItem {...{ item, sectionIndex, handleScroll }} />
              )}
            />
          </View>
        )}
      >
        <Screen preset="fixed" safeAreaEdges={["top"]} contentContainerStyle={$screenContainer}>
          <DrawerIconButton onPress={toggleDrawer} />

          <SectionList
            ref={listRef}
            contentContainerStyle={$sectionListContentContainer}
            stickySectionHeadersEnabled={false}
            sections={Object.values(Demos)}
            renderItem={({ item }) => item}
            renderSectionFooter={() => <View style={$demoUseCasesSpacer} />}
            ListHeaderComponent={
              <View style={$heading}>
                <Text preset="heading" tx="demoShowroomScreen.jumpStart" />
              </View>
            }
            onScrollToIndexFailed={scrollToIndexFailed}
            renderSectionHeader={({ section }) => {
              return (
                <View>
                  <Text preset="heading" style={$demoItemName}>
                    {section.name}
                  </Text>
                  <Text style={$demoItemDescription}>{section.description}</Text>
                </View>
              )
            }}
          />
        </Screen>
      </Drawer>
    )
  }

const $screenContainer: ViewStyle = {
  flex: 1,
  backgroundColor: colors.palette.neutral200,
}

const $tvScreenContainer: ViewStyle = {
  flex: 1,
  flexDirection: "row",
  width: "100%",
  backgroundColor: colors.palette.neutral200,
}

const $tvMainContentContainer: ViewStyle = {
  flex: 4,
}

const $drawer: ViewStyle = {
  backgroundColor: colors.background,
  flex: 1,
}

const $listContentContainer: ContentStyle = {
  paddingHorizontal: spacing.lg,
}

const $sectionListContentContainer: ViewStyle = {
  paddingHorizontal: spacing.lg,
}

const $heading: ViewStyle = {
  marginBottom: spacing.xxxl,
}

const $logoImage: ImageStyle = {
  height: spacing._42,
  width: spacing._77,
}

const $logoContainer: ViewStyle = {
  alignSelf: "flex-start",
  justifyContent: "center",
  height: spacing._56,
  paddingHorizontal: spacing.lg,
}

const $menuContainer: ViewStyle = {
  paddingBottom: spacing.xs,
  paddingTop: spacing.lg,
}

const $menuContainerText: TextStyle = {
  fontSize: spacing.sm,
}

const $demoItemName: TextStyle = {
  fontSize: spacing.lg,
  marginBottom: spacing.md,
}

const $demoItemDescription: TextStyle = {
  marginBottom: spacing.xxl,
}

const $demoUseCasesSpacer: ViewStyle = {
  paddingBottom: spacing.xxl,
}

const $cardTitle: TextStyle = {
  fontSize: 16,
  fontWeight: "bold",
  marginStart: 16,
  marginBottom: spacing.sm,
  color: colors.text,
}

const $sectionListContainer: ViewStyle = {
  paddingBottom: spacing.xxl,
};

const $cardStyle: ViewStyle = {
  backgroundColor: '#fff',
  borderRadius: 8,
  padding: 16,
};


const $cardShadow: ViewStyle = {

  shadowOffset: {
    width: 0,
    height: 0,
  },

}

const $imageBackgroundCard: ViewStyle = {
  flex: 1,
}