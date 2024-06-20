class Star:
    def __init__(self, radius, color, position):
        self.radius = radius
        self.color = color
        self.position = position

    def draw(self, image):
        draw = ImageDraw.Draw(image)
        left_up_point = (self.position[0] - self.radius, self.position[1] - self.radius)
        right_down_point = (self.position[0] + self.radius, self.position[1] + self.radius)
        draw.ellipse([left_up_point, right_down_point], fill=self.color + (255,))

    @classmethod
    def from_dict(cls, data):
        return cls(
            radius=data.get('radius', random.randint(5, 10)),
            color=data.get('color', (255, 255, 255)),
            position=data.get('position', (random.randint(0, 1200), random.randint(0, 1200)))
        )


class Corona:
    def __init__(self, star_radius, outer_radius, color, position):
        self.inner_radius = star_radius
        self.outer_radius = outer_radius
        self.color = color
        self.position = position

    def draw(self, image):
        draw = ImageDraw.Draw(image)
        for i in range(self.inner_radius, self.outer_radius):
            alpha = int(255 * (1 - (i - self.inner_radius) / (self.outer_radius - self.inner_radius)) ** 2)
            left_up_point = (self.position[0] - i, self.position[1] - i)
            right_down_point = (self.position[0] + i, self.position[1] + i)
            draw.ellipse([left_up_point, right_down_point], outline=self.color + (alpha,), width=1)

    @classmethod
    def from_dict(cls, data):
        return cls(
            star_radius=data['star_radius'],
            outer_radius=data.get('outer_radius', data['star_radius'] + random.randint(1, 10)),
            color=data.get('color', (random.randint(0, 255), random.randint(0, 255), random.randint(0, 255))),
            position=data['position']
        )


class StarSpike:
    def __init__(self, length, width, color, position, orientation):
        self.length = length
        self.width = width
        self.color = color
        self.position = position
        self.orientation = orientation

    def draw(self, image):
        draw = ImageDraw.Draw(image)
        if self.orientation == 'horizontal':
            left_up_point = (self.position[0] - self.length, self.position[1] - self.width // 2)
            right_down_point = (self.position[0] + self.length, self.position[1] + self.width // 2)
        else:
            left_up_point = (self.position[0] - self.width // 2, self.position[1] - self.length)
            right_down_point = (self.position[0] + self.width // 2, self.position[1] + self.length)
        draw.ellipse([left_up_point, right_down_point], fill=self.color + (255,))

    @classmethod
    def from_dict(cls, data):
        return cls(
            length=data['length'],
            width=data['width'],
            color=data.get('color', (255, 255, 255)),
            position=data['position'],
            orientation=data['orientation']
        )


class StarSpikeCorona:
    def __init__(self, inner_length, outer_length, width, color, position, orientation):
        self.inner_length = inner_length
        self.outer_length = outer_length
        self.width = width
        self.color = color
        self.position = position
        self.orientation = orientation

    def draw(self, image):
        draw = ImageDraw.Draw(image)
        for i in range(self.inner_length, self.outer_length):
            alpha = int(255 * (1 - (i - self.inner_length) / (self.outer_length - self.inner_length)) ** 2)
            if self.orientation == 'horizontal':
                left_up_point = (self.position[0] - i, self.position[1] - self.width // 2)
                right_down_point = (self.position[0] + i, self.position[1] + self.width // 2)
            else:
                left_up_point = (self.position[0] - self.width // 2, self.position[1] - i)
                right_down_point = (self.position[0] + self.width // 2, self.position[1] + i)
            draw.ellipse([left_up_point, right_down_point], outline=self.color + (alpha,), width=1)

    @classmethod
    def from_dict(cls, data):
        return cls(
            inner_length=data['inner_length'],
            outer_length=data['outer_length'],
            width=data['width'],
            color=data.get('color', (255, 255, 255)),
            position=data['position'],
            orientation=data['orientation']
        )


class StarrySkyAnimationWithVariedRaysAndTiming:
    min_radius = 5
    max_radius = 10
    min_outer_radius_offset = 1
    max_outer_radius_offset = 10
    min_twinkle_interval = 10
    max_twinkle_interval = 30
    min_spike_length = 5
    max_spike_length = 10
    spike_width = 3

    def __init__(self, size=(1200, 1200), background_color=(0, 0, 0), star_count=20, frame_count=60, star_positions=None):
        self.size = size
        self.background_color = background_color
        self.star_count = star_count
        self.frame_count = frame_count
        self.image_sequence = []
        self.stars = [
            Star.from_dict({
                'radius': random.randint(self.min_radius, self.max_radius),
                'position': position
            }) for position in (star_positions or [(random.randint(0, size[0]), random.randint(0, size[1])) for _ in range(star_count)])
        ]
        self.coronas = [
            Corona.from_dict({
                'star_radius': star.radius,
                'position': star.position
            }) for star in self.stars
        ]
        self.twinkle_intervals = [random.randint(self.min_twinkle_interval, self.max_twinkle_interval) for _ in range(self.star_count)]

    def create_spikes(self, image, star, spike_length, num_rays, frame):
        orientations = ['horizontal', 'vertical']
        colors = [(0, 255, 0), (0, 255, 0)]
        
        # Determine the length of the spike based on the frame in the 5-frame sequence
        if frame % 5 == 0 or frame % 5 == 4:
            adjusted_length = spike_length * 1/3
        elif frame % 5 == 1 or frame % 5 == 3:
            adjusted_length = spike_length * 2/3
        else:
            adjusted_length = spike_length
        
        for _ in range(num_rays // 2):
            for orientation, color in zip(orientations, colors):
                spike = StarSpike.from_dict({
                    'length': adjusted_length * self.min_spike_length,
                    'width': self.spike_width,
                    'position': star.position,
                    'orientation': orientation
                })
                spike.draw(image)
                spike_corona = StarSpikeCorona.from_dict({
                    'inner_length': adjusted_length * self.min_spike_length,
                    'outer_length': adjusted_length * self.min_spike_length + 10,
                    'width': self.spike_width + 1,
                    'color': (255, 255, 0),
                    'position': star.position,
                    'orientation': orientation
                })
                spike_corona.draw(image)
            orientations = orientations[::-1]  # Switch between horizontal and vertical


    def create_frame(self, frame_index):
        image = self.background_image.copy()
        for star, corona in zip(self.stars, self.coronas):
            star.draw(image)
            corona.draw(image)

        for star, interval in zip(self.stars, self.twinkle_intervals):
            if frame_index % interval == 0:
                spike_length = (frame_index % 20) + 1
                num_rays = random.choice([4, 8])
                self.create_spikes(image, star, spike_length, num_rays, frame_index)
        return image


    def generate_animation(self):
        for frame_index in range(self.frame_count):
            frame = self.create_frame(frame_index)
            self.image_sequence.append(frame)
        return self.image_sequence

    def save_gif(self, filename):
        self.image_sequence[0].save(
            filename,
            save_all=True,
            append_images=self.image_sequence[1:],
            duration=100,
            loop=0,
            optimize=False
        )


if __name__ == "__main__":
    # Example usage with specified star positions
    star_positions = [(100, 100), (200, 200), (300, 300), (400, 400), (500, 500)]
    animation = StarrySkyAnimationWithVariedRaysAndTiming(star_count=5, frame_count=60, star_positions=star_positions)
    animation.generate_animation()
    animation.save_gif('../../data/twinkle_stars_with_smooth_corona.gif')
